import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Upload, FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { logAdminAction } from "@/hooks/use-admin-log";

type CsvRow = Record<string, string>;

export default function AdminImport() {
  const [rows, setRows] = useState<CsvRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [importing, setImporting] = useState(false);
  const [results, setResults] = useState<{ success: number; errors: number }>({ success: 0, errors: 0 });
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  const parseCSV = (text: string) => {
    const lines = text.split("\n").filter((l) => l.trim());
    if (lines.length < 2) return;
    const hdrs = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""));
    setHeaders(hdrs);
    const data = lines.slice(1).map((line) => {
      const vals = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""));
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
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      parseCSV(text);
    };
    reader.readAsText(file);
    setDone(false);
    setResults({ success: 0, errors: 0 });
  };

  const importRows = async () => {
    setImporting(true);
    let success = 0;
    let errors = 0;

    for (const row of rows) {
      const { error } = await supabase.rpc("admin_import_prestataire" as any, {
        _nom_entreprise: row.name || row.nom_entreprise || "Sans nom",
        _ville: row.city || row.ville || null,
        _pays: row.country || row.pays || "France",
        _description: row.description || null,
        _telephone: row.phone || row.telephone || null,
        _categorie_id: row.category_id || row.categorie_id || null,
        _statut: row.status || row.statut || "en_attente",
      });
      if (error) errors++;
      else success++;
    }

    setResults({ success, errors });
    setDone(true);
    setImporting(false);
    await logAdminAction("csv_import", "prestataires", undefined, { total: rows.length, success, errors });
    toast({ title: "Import terminé", description: `${success} importés, ${errors} erreurs` });
  };

  return (
    <div>
      <h1 className="text-2xl font-serif text-champagne mb-6">Import CSV</h1>

      <Card className="bg-[#1a1a2e] border-champagne/10 mb-6">
        <CardHeader>
          <CardTitle className="text-ivory text-lg">Format attendu</CardTitle>
        </CardHeader>
        <CardContent>
          <code className="text-xs text-champagne/70 font-body block bg-[#0f0f23] p-3 rounded-lg">
            name,city,country,phone,description,category_id,status
          </code>
          <p className="text-xs text-ivory/40 mt-2 font-body">Colonnes alternatives : nom_entreprise, ville, pays, telephone, categorie_id, statut</p>
        </CardContent>
      </Card>

      <div className="flex gap-4 mb-6">
        <div className="relative">
          <Input type="file" accept=".csv" onChange={handleFile} className="hidden" id="csv-upload" />
          <Button asChild className="bg-champagne text-chocolate hover:bg-champagne/90">
            <label htmlFor="csv-upload" className="cursor-pointer flex items-center gap-2">
              <FileText size={16} /> Choisir un fichier CSV
            </label>
          </Button>
        </div>
        {rows.length > 0 && !done && (
          <Button onClick={importRows} disabled={importing} className="bg-green-600 hover:bg-green-700 text-white">
            {importing ? <Loader2 size={16} className="animate-spin mr-2" /> : <Upload size={16} className="mr-2" />}
            Importer {rows.length} lignes
          </Button>
        )}
      </div>

      {done && (
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-2 text-green-400"><CheckCircle2 size={18} /> {results.success} importés</div>
          {results.errors > 0 && <div className="flex items-center gap-2 text-red-400"><AlertCircle size={18} /> {results.errors} erreurs</div>}
        </div>
      )}

      {rows.length > 0 && (
        <div className="rounded-xl border border-champagne/10 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-champagne/10 hover:bg-transparent">
                {headers.map((h) => <TableHead key={h} className="text-champagne/70">{h}</TableHead>)}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.slice(0, 20).map((row, i) => (
                <TableRow key={i} className="border-champagne/10 hover:bg-white/5">
                  {headers.map((h) => <TableCell key={h} className="text-ivory/70 text-xs">{row[h]}</TableCell>)}
                </TableRow>
              ))}
              {rows.length > 20 && (
                <TableRow><TableCell colSpan={headers.length} className="text-center text-ivory/40 py-4">... et {rows.length - 20} autres lignes</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
