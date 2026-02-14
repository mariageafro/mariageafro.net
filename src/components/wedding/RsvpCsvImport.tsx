import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, FileText, AlertCircle } from "lucide-react";

interface CsvGuest {
  first_name: string;
  last_name: string;
  email: string;
  group_name: string;
  max_companions: number;
}

interface Props {
  onImport: (guests: CsvGuest[]) => Promise<void>;
}

export function RsvpCsvImport({ onImport }: Props) {
  const { toast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<CsvGuest[] | null>(null);
  const [importing, setImporting] = useState(false);

  const parseCsv = (text: string): CsvGuest[] => {
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    if (lines.length < 2) return [];

    // Detect separator
    const sep = lines[0].includes(";") ? ";" : ",";
    const headers = lines[0].split(sep).map(h => h.trim().toLowerCase().replace(/['"]/g, ""));

    const firstNameIdx = headers.findIndex(h => ["prénom", "prenom", "first_name", "firstname"].includes(h));
    const lastNameIdx = headers.findIndex(h => ["nom", "last_name", "lastname"].includes(h));
    const emailIdx = headers.findIndex(h => ["email", "e-mail", "mail"].includes(h));
    const groupIdx = headers.findIndex(h => ["groupe", "group", "group_name"].includes(h));
    const compIdx = headers.findIndex(h => ["accompagnants", "companions", "max_companions", "accompagnants max"].includes(h));

    if (firstNameIdx === -1) return [];

    return lines.slice(1).map(line => {
      const cols = line.split(sep).map(c => c.trim().replace(/^["']|["']$/g, ""));
      return {
        first_name: cols[firstNameIdx] || "",
        last_name: cols[lastNameIdx] || "",
        email: cols[emailIdx] || "",
        group_name: cols[groupIdx] || "Autre",
        max_companions: parseInt(cols[compIdx]) || 0,
      };
    }).filter(g => g.first_name.trim());
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const guests = parseCsv(text);
      if (guests.length === 0) {
        toast({ title: "Fichier invalide", description: "Assurez-vous que le CSV contient au moins une colonne 'Prénom'.", variant: "destructive" });
        return;
      }
      setPreview(guests);
    };
    reader.readAsText(file, "UTF-8");
    e.target.value = "";
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    try {
      await onImport(preview);
      toast({ title: `${preview.length} invité(s) importé(s) !` });
      setPreview(null);
    } catch {
      toast({ title: "Erreur lors de l'import", variant: "destructive" });
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-3">
      <input ref={fileRef} type="file" accept=".csv,.txt" className="hidden" onChange={handleFile} />

      {!preview ? (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <Button variant="outline" size="sm" className="gap-2 text-xs" onClick={() => fileRef.current?.click()}>
            <Upload size={14} />Importer un CSV
          </Button>
          <p className="text-xs text-muted-foreground font-body">
            Colonnes attendues : <code className="text-[10px] bg-muted px-1 rounded">Prénom, Nom, Email, Groupe, Accompagnants</code>
          </p>
        </div>
      ) : (
        <div className="card-glass p-4 space-y-3 border-2 border-primary/20">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-primary" />
            <h3 className="font-serif text-base text-foreground">Aperçu de l'import ({preview.length} invité{preview.length > 1 ? "s" : ""})</h3>
          </div>

          <div className="max-h-48 overflow-auto text-xs font-body">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground border-b">
                  <th className="py-1 pr-2">Prénom</th>
                  <th className="py-1 pr-2">Nom</th>
                  <th className="py-1 pr-2">Email</th>
                  <th className="py-1 pr-2">Groupe</th>
                  <th className="py-1">Acc.</th>
                </tr>
              </thead>
              <tbody>
                {preview.slice(0, 20).map((g, i) => (
                  <tr key={i} className="border-b border-muted/30">
                    <td className="py-1 pr-2">{g.first_name}</td>
                    <td className="py-1 pr-2">{g.last_name}</td>
                    <td className="py-1 pr-2">{g.email}</td>
                    <td className="py-1 pr-2">{g.group_name}</td>
                    <td className="py-1">{g.max_companions}</td>
                  </tr>
                ))}
                {preview.length > 20 && (
                  <tr><td colSpan={5} className="py-1 text-muted-foreground italic">...et {preview.length - 20} de plus</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {preview.some(g => !g.email) && (
            <p className="text-xs text-destructive/80 font-body flex items-center gap-1">
              <AlertCircle size={12} /> Certains invités n'ont pas d'email — ils ne recevront pas de rappels automatiques.
            </p>
          )}

          <div className="flex gap-2">
            <Button onClick={handleImport} disabled={importing} className="btn-gold text-xs">
              {importing ? "Import en cours..." : `Importer ${preview.length} invité(s)`}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setPreview(null)}>Annuler</Button>
          </div>
        </div>
      )}
    </div>
  );
}
