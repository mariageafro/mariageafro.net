import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type CsvRow = Record<string, string>;
type ImportResult = { success: number; errors: number; drafts: number; errorRows: { row: number; error: string }[] };

export default function AdminImport() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<ImportResult | null>(null);
  const [batchName, setBatchName] = useState(`launch_${new Date().toISOString().slice(0, 10).replace(/-/g, "_")}`);
  const { toast } = useToast();

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return;
    const hdrs = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hdrs);
    const data = lines.slice(1).map((line) => {
      // Handle quoted CSV values
      const vals: string[] = [];
      let current = "";
      let inQuotes = false;
      for (const char of line) {
        if (char === '"') { inQuotes = !inQuotes; }
        else if (char === ',' && !inQuotes) { vals.push(current.trim()); current = ""; }
        else { current += char; }
      }
      vals.push(current.trim());
      const row: CsvRow = {};
      hdrs.forEach((h, i) => { row[h] = vals[i] || ""; });
      return row;
    });
    setRows(data);
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => parseCSV(ev.target?.result as string);
    reader.readAsText(file);
    setResults(null);
  };

  const importRows = async () => {
    setImporting(true);
    let success = 0, errors = 0, drafts = 0;
    const errorRows: { row: number; error: string }[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const photoUrl = row.photo_url || row.image || "";
      const hasMissingPhoto = !photoUrl.trim();
      const requestedStatus = row.status || row.statut || "actif";
      const badgeType = row.badge_type || "FREE";

      const { error } = await (supabase as any).rpc("admin_import_prestataire", {
        _nom_entreprise: row.name || row.nom_entreprise || "Sans nom",
        _ville: row.city || row.ville || null,
        _pays: row.country || row.pays || "France",
        _description: row.description || row.description_fr || null,
        _description_fr: row.description_fr || row.description || null,
        _description_en: row.description_en || null,
        _telephone: row.phone || row.telephone || null,
        _categorie_id: row.category_id || row.categorie_id || null,
        _photo_url: photoUrl || null,
        _email: row.email || null,
        _instagram: row.instagram || null,
        _whatsapp: row.whatsapp || null,
        _site_web: row.website || row.site_web || null,
        _badge_type: badgeType,
        _free_until: row.free_until || null,
        _is_featured: row.is_featured === "true" || row.is_featured === "1",
        _is_lifetime_featured: row.is_lifetime_featured === "true" || row.is_lifetime_featured === "1" || badgeType === "FOUNDER" || badgeType === "VIP",
        _priority_score: parseInt(row.priority_score) || 0,
        _import_batch: batchName,
        _statut: hasMissingPhoto ? "draft" : requestedStatus,
      });

      if (error) {
        errors++;
        errorRows.push({ row: i + 2, error: error.message });
      } else {
        if (hasMissingPhoto) drafts++;
        else success++;
      }
    }

    const result = { success, errors, drafts, errorRows };
    setResults(result);
    setImporting(false);
    await logAdminAction("csv_import", "prestataires", undefined, { batch: batchName, total: rows.length, ...result });
    toast({ title: "Import terminé", description: `${success} actifs, ${drafts} brouillons, ${errors} erreurs` });
  };

  const missingPhotoRows = rows.filter(r => !(r.photo_url || r.image)?.trim());

  return (
    <div>
      <h1 className="text-2xl font-serif text-champagne mb-6">Import CSV</h1>

      <Card className="bg-[#1a1a2e] border-champagne/10 mb-6">
        <CardHeader><CardTitle className="text-ivory text-lg">Format CSV attendu</CardTitle></CardHeader>
        <CardContent>
          <code className="text-xs text-champagne/70 font-body block bg-[#0f0f23] p-3 rounded-lg overflow-x-auto">
            name,category_id,country,city,description_fr,description_en,photo_url,instagram,whatsapp,phone,website,email,badge_type,free_until,is_featured,is_lifetime_featured,priority_score,status,import_batch
          </code>
          <div className="mt-3 space-y-1 text-xs text-ivory/40 font-body">
            <p>⚠️ <strong className="text-yellow-400">photo_url est obligatoire</strong> pour le statut "actif". Les lignes sans photo seront importées en "brouillon".</p>
            <p>Badge types: FOUNDER, VIP, AMBASSADOR, PREMIUM, FREE</p>
            <p>free_until: date format YYYY-MM-DD (pour Ambassador 3 mois gratuit)</p>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6 flex-wrap items-end">
        <div>
          <label className="text-xs text-ivory/60 mb-1 block">Nom du batch</label>
          <Input value={batchName} onChange={(e) => setBatchName(e.target.value)} className="bg-[#1a1a2e] border-champagne/20 text-ivory w-64" />
        </div>
        <div className="relative">
          <Input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv-upload" />
          <Button asChild className="bg-champagne text-chocolate hover:bg-champagne/90">
            <label htmlFor="csv-upload" className="cursor-pointer flex items-center gap-2"><FileText size={16} /> Choisir un fichier CSV</label>
          </Button>
        </div>
        {rows.length > 0 && !results && (
          <Button onClick={importRows} disabled={importing} className="bg-green-600 hover:bg-green-700 text-white">
            {importing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
            Importer {rows.length} lignes
          </Button>
        )}
      </div>

      {/* Warnings before import */}
      {rows.length > 0 && !results && missingPhotoRows.length > 0 && (
        <div className="flex items-center gap-2 text-yellow-400 mb-4 bg-yellow-500/10 p-3 rounded-lg">
          <AlertTriangle size={18} />
          <span className="text-sm">{missingPhotoRows.length} ligne(s) sans photo_url seront importées en brouillon (draft).</span>
        </div>
      )}

      {/* Results */}
      {results && (
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-2 text-green-400"><CheckCircle2 size={18} /> {results.success} actifs</div>
          {results.drafts > 0 && <div className="flex items-center gap-2 text-yellow-400"><AlertTriangle size={18} /> {results.drafts} brouillons (sans photo)</div>}
          {results.errors > 0 && <div className="flex items-center gap-2 text-red-400"><AlertCircle size={18} /> {results.errors} erreurs</div>}
        </div>
      )}

      {/* Error details */}
      {results && results.errorRows.length > 0 && (
        <Card className="bg-red-500/10 border-red-500/20 mb-6">
          <CardHeader><CardTitle className="text-red-400 text-sm">Erreurs d'import</CardTitle></CardHeader>
          <CardContent className="space-y-1">
            {results.errorRows.map((e, i) => (
              <p key={i} className="text-xs text-red-300">Ligne {e.row}: {e.error}</p>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Preview table */}
      {rows.length > 0 && (
        <div className="rounded-xl border border-champagne/10 overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-champagne/10 hover:bg-transparent">
                <TableHead className="text-champagne/70">#</TableHead>
                {headers.slice(0, 8).map((h) => <TableHead key={h} className="text-champagne/70 text-xs">{h}</TableHead>)}
                <TableHead className="text-champagne/70 text-xs">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 30).map((row, i) => {
                const hasPhoto = !!(row.photo_url || row.image)?.trim();
                return (
                  <TableRow key={i} className={`border-champagne/10 hover:bg-white/5 ${!hasPhoto ? "bg-yellow-500/5" : ""}`}>
                    <TableCell className="text-ivory/40 text-xs">{i + 2}</TableCell>
                    {headers.slice(0, 8).map((h) => <TableCell key={h} className="text-ivory/70 text-xs max-w-[150px] truncate">{row[h]}</TableCell>)}
                    <TableCell>
                      {hasPhoto ? <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">OK</Badge> : <Badge className="bg-yellow-500/20 text-yellow-400 border-0 text-xs">Draft</Badge>}
                    </TableCell>
                  </TableRow>
                );
              })}
              {rows.length > 30 && (
                <TableRow><TableCell colSpan={10} className="text-center text-ivory/40 py-4">... et {rows.length - 30} autres lignes</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
