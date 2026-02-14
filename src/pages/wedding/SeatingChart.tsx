import { useState, useEffect, useCallback } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useRsvpEvent, useRsvpGuests, RsvpGuest } from "@/hooks/use-rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, GripVertical, Save, RotateCcw, Printer } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Table {
  id: string;
  name: string;
  capacity: number;
  guests: string[]; // guest IDs
}

interface SeatingData {
  tables: Table[];
}

export default function SeatingChart() {
  const { user, isLoading: authLoading } = useAuthContext();
  const { event } = useRsvpEvent();
  const { guests } = useRsvpGuests(event?.id);
  const { toast } = useToast();

  const [tables, setTables] = useState<Table[]>([]);
  const [draggedGuest, setDraggedGuest] = useState<string | null>(null);
  const [newTableName, setNewTableName] = useState("");
  const [newTableCapacity, setNewTableCapacity] = useState("8");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const confirmedGuests = guests.filter(g => g.status === "confirmed");

  // Load saved seating data
  useEffect(() => {
    if (!user || loaded) return;
    supabase
      .from("user_tools")
      .select("data")
      .eq("user_id", user.id)
      .eq("tool_slug", "seating-chart")
      .maybeSingle()
      .then(({ data }) => {
        if (data?.data) {
          const saved = data.data as unknown as SeatingData;
          if (saved.tables) setTables(saved.tables);
        }
        setLoaded(true);
      });
  }, [user, loaded]);

  const saveData = async () => {
    if (!user) return;
    setSaving(true);
    const payload: SeatingData = { tables };
    await supabase
      .from("user_tools")
      .upsert({ user_id: user.id, tool_slug: "seating-chart", data: payload as any }, { onConflict: "user_id,tool_slug" });
    setSaving(false);
    toast({ title: "Plan de table sauvegardé !" });
  };

  const addTable = () => {
    const name = newTableName.trim() || `Table ${tables.length + 1}`;
    setTables(prev => [...prev, { id: crypto.randomUUID(), name, capacity: parseInt(newTableCapacity) || 8, guests: [] }]);
    setNewTableName("");
  };

  const removeTable = (tableId: string) => {
    setTables(prev => prev.filter(t => t.id !== tableId));
  };

  const handleDragStart = (guestId: string) => {
    setDraggedGuest(guestId);
  };

  const handleDrop = (tableId: string) => {
    if (!draggedGuest) return;
    setTables(prev => {
      // Remove guest from all tables first
      const cleaned = prev.map(t => ({ ...t, guests: t.guests.filter(g => g !== draggedGuest) }));
      // Add to target table
      return cleaned.map(t => {
        if (t.id === tableId && t.guests.length < t.capacity) {
          return { ...t, guests: [...t.guests, draggedGuest] };
        }
        return t;
      });
    });
    setDraggedGuest(null);
  };

  const handleDropUnassigned = () => {
    if (!draggedGuest) return;
    setTables(prev => prev.map(t => ({ ...t, guests: t.guests.filter(g => g !== draggedGuest) })));
    setDraggedGuest(null);
  };

  const removeGuestFromTable = (tableId: string, guestId: string) => {
    setTables(prev => prev.map(t => t.id === tableId ? { ...t, guests: t.guests.filter(g => g !== guestId) } : t));
  };

  const assignedIds = new Set(tables.flatMap(t => t.guests));
  const unassigned = confirmedGuests.filter(g => !assignedIds.has(g.id));
  const guestMap = new Map(confirmedGuests.map(g => [g.id, g]));

  const exportPdf = () => {
    const tablesHtml = tables.map(table => {
      const tGuests = table.guests.map(id => guestMap.get(id)).filter(Boolean);
      const emptySlots = Math.max(0, table.capacity - tGuests.length);
      return `
        <div style="break-inside:avoid;border:2px solid #c9a96e;border-radius:12px;padding:16px;margin-bottom:16px;background:#fffbf5;">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;border-bottom:1px solid #e8dcc8;padding-bottom:8px;">
            <h3 style="margin:0;font-family:'Cormorant Garamond',serif;font-size:20px;color:#5c4033;">${table.name}</h3>
            <span style="font-size:12px;color:#8b7355;font-family:'Lora',serif;">${tGuests.length}/${table.capacity} places</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
            ${tGuests.map(g => `<div style="padding:4px 8px;font-size:13px;font-family:'Lora',serif;color:#3d2b1f;">\u2022 ${g!.first_name} ${g!.last_name || ''}</div>`).join('')}
            ${Array(emptySlots).fill('<div style="padding:4px 8px;font-size:12px;color:#ccc;font-style:italic;">\u2014 libre \u2014</div>').join('')}
          </div>
        </div>`;
    }).join('');

    const unassignedHtml = unassigned.length > 0 ? `
      <div style="break-inside:avoid;border:1px dashed #ccc;border-radius:12px;padding:16px;margin-top:24px;">
        <h3 style="margin:0 0 8px;font-family:'Cormorant Garamond',serif;font-size:18px;color:#8b7355;">Invit\u00e9s non plac\u00e9s (${unassigned.length})</h3>
        <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:4px;">
          ${unassigned.map(g => `<div style="padding:2px 6px;font-size:12px;font-family:'Lora',serif;color:#666;">\u2022 ${g.first_name} ${g.last_name || ''}</div>`).join('')}
        </div>
      </div>` : '';

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html><html><head><title>Plan de table</title>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600&family=Lora:wght@400;500&display=swap" rel="stylesheet">
      <style>@page{margin:20mm;}body{font-family:'Lora',serif;color:#3d2b1f;max-width:800px;margin:0 auto;padding:20px;}</style>
    </head><body>
      <div style="text-align:center;margin-bottom:32px;border-bottom:2px solid #c9a96e;padding-bottom:16px;">
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:32px;color:#5c4033;margin:0;">Plan de table</h1>
        <p style="font-size:14px;color:#8b7355;margin:8px 0 0;">${confirmedGuests.length} invit\u00e9(s) confirm\u00e9(s) \u00b7 ${tables.length} table(s)</p>
      </div>
      <div style="columns:2;column-gap:20px;">${tablesHtml}</div>
      ${unassignedHtml}
      <div style="text-align:center;margin-top:32px;font-size:11px;color:#bbb;">Imprim\u00e9 le ${new Date().toLocaleDateString('fr-FR')}</div>
    </body></html>`);
    printWindow.document.close();
    printWindow.onload = () => { printWindow.print(); };
  };

  if (authLoading) return null;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/mon-mariage/rsvp" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body">
            ← Retour au RSVP
          </Link>
          <div className="flex items-center justify-between mt-2">
            <h1 className="font-serif text-chocolate text-3xl md:text-4xl">Plan de table</h1>
            <div className="flex gap-2">
              {tables.length > 0 && (
                <Button onClick={exportPdf} variant="outline" className="gap-2">
                  <Printer size={14} />Imprimer / PDF
                </Button>
              )}
              <Button onClick={saveData} disabled={saving} className="btn-gold gap-2">
                <Save size={14} />{saving ? "Sauvegarde..." : "Sauvegarder"}
              </Button>
            </div>
          </div>
          <p className="font-body text-sm text-muted-foreground mt-1">
            {confirmedGuests.length} invité(s) confirmé(s) · {unassigned.length} non placé(s)
          </p>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: Unassigned guests */}
            <div
              className="lg:col-span-1"
              onDragOver={e => e.preventDefault()}
              onDrop={handleDropUnassigned}
            >
              <div className="card-glass p-4 space-y-3 sticky top-24">
                <h2 className="font-serif text-lg text-foreground flex items-center gap-2">
                  <Users size={16} className="text-primary" /> Invités non placés ({unassigned.length})
                </h2>
                <div className="space-y-1 max-h-[60vh] overflow-auto">
                  {unassigned.length === 0 ? (
                    <p className="text-xs text-muted-foreground font-body text-center py-4">
                      {confirmedGuests.length === 0 ? "Aucun invité confirmé" : "Tous les invités sont placés ! 🎉"}
                    </p>
                  ) : (
                    unassigned.map(guest => (
                      <div
                        key={guest.id}
                        draggable
                        onDragStart={() => handleDragStart(guest.id)}
                        className="flex items-center gap-2 p-2 rounded-lg bg-background/60 border border-border/50 cursor-grab active:cursor-grabbing hover:border-primary/30 transition-colors"
                      >
                        <GripVertical size={12} className="text-muted-foreground shrink-0" />
                        <span className="text-sm font-body text-foreground truncate">
                          {guest.first_name} {guest.last_name || ""}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 ml-auto shrink-0">{guest.group_name}</Badge>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right: Tables */}
            <div className="lg:col-span-2 space-y-4">
              {/* Add table form */}
              <div className="card-glass p-4 flex flex-col sm:flex-row gap-3 items-end">
                <div className="flex-1">
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Nom de la table</label>
                  <Input placeholder={`Table ${tables.length + 1}`} value={newTableName} onChange={e => setNewTableName(e.target.value)} className="h-9" />
                </div>
                <div className="w-24">
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Places</label>
                  <Input type="number" min="1" max="20" value={newTableCapacity} onChange={e => setNewTableCapacity(e.target.value)} className="h-9" />
                </div>
                <Button onClick={addTable} className="btn-gold h-9 gap-1"><Plus size={14} />Ajouter</Button>
              </div>

              {/* Tables grid */}
              {tables.length === 0 ? (
                <div className="card-glass p-8 text-center">
                  <p className="text-muted-foreground font-body">Commencez par créer des tables, puis glissez-déposez vos invités.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tables.map(table => {
                    const tableGuests = table.guests.map(id => guestMap.get(id)).filter(Boolean) as RsvpGuest[];
                    const isFull = tableGuests.length >= table.capacity;

                    return (
                      <div
                        key={table.id}
                        className={`card-glass p-4 space-y-2 transition-all ${draggedGuest && !isFull ? "ring-2 ring-primary/30 ring-dashed" : ""}`}
                        onDragOver={e => { if (!isFull) e.preventDefault(); }}
                        onDrop={() => handleDrop(table.id)}
                      >
                        <div className="flex items-center justify-between">
                          <h3 className="font-serif text-base text-foreground">{table.name}</h3>
                          <div className="flex items-center gap-2">
                            <Badge variant={isFull ? "default" : "secondary"} className="text-[10px]">
                              {tableGuests.length}/{table.capacity}
                            </Badge>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeTable(table.id)}>
                              <Trash2 size={12} className="text-destructive" />
                            </Button>
                          </div>
                        </div>

                        <div className="min-h-[60px] space-y-1">
                          {tableGuests.length === 0 ? (
                            <p className="text-xs text-muted-foreground font-body text-center py-3 border border-dashed border-border/60 rounded-lg">
                              Glissez des invités ici
                            </p>
                          ) : (
                            tableGuests.map(guest => (
                              <div
                                key={guest.id}
                                draggable
                                onDragStart={() => handleDragStart(guest.id)}
                                className="flex items-center gap-2 p-1.5 rounded bg-primary/5 border border-primary/10 cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical size={10} className="text-muted-foreground shrink-0" />
                                <span className="text-xs font-body text-foreground truncate flex-1">
                                  {guest.first_name} {guest.last_name || ""}
                                </span>
                                <button
                                  onClick={() => removeGuestFromTable(table.id, guest.id)}
                                  className="text-muted-foreground hover:text-destructive shrink-0"
                                >
                                  <Trash2 size={10} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
