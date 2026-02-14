import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { useAuthContext } from "@/contexts/auth-context";
import { useRsvpEvent, useRsvpGuests, RsvpGuest } from "@/hooks/use-rsvp";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Users, GripVertical, Save, Printer, Circle, RectangleHorizontal } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

type TableShape = "round" | "rectangle";

interface Table {
  id: string;
  name: string;
  capacity: number;
  shape: TableShape;
  guests: string[];
}

interface SeatingData {
  tables: Table[];
}

function TableVisual({ table, guests, isDragTarget, onDrop, onDragOver, onRemoveGuest, onDragStart, onRemoveTable }: {
  table: Table;
  guests: RsvpGuest[];
  isDragTarget: boolean;
  onDrop: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onRemoveGuest: (guestId: string) => void;
  onDragStart: (guestId: string) => void;
  onRemoveTable: () => void;
}) {
  const isFull = guests.length >= table.capacity;
  const isRound = table.shape === "round";
  
  return (
    <div
      className={`relative transition-all ${isDragTarget ? "scale-[1.02]" : ""}`}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {/* Visual table shape */}
      <div className={`relative mx-auto ${isRound ? "w-48 h-48" : "w-56 h-36"}`}>
        <div className={`absolute inset-0 border-2 transition-all ${
          isDragTarget ? "border-primary shadow-lg shadow-primary/20" : "border-primary/30"
        } ${isRound ? "rounded-full" : "rounded-2xl"} bg-gradient-to-br from-primary/5 to-primary/10`} />
        
        {/* Table name centered */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-sm text-foreground font-medium">{table.name}</span>
          <span className="text-[10px] text-muted-foreground font-body">{guests.length}/{table.capacity}</span>
          {isRound ? (
            <Circle size={10} className="text-primary/40 mt-0.5" />
          ) : (
            <RectangleHorizontal size={10} className="text-primary/40 mt-0.5" />
          )}
        </div>

        {/* Guest seats around the table */}
        {guests.map((guest, i) => {
          const total = Math.max(guests.length, table.capacity);
          const angle = (2 * Math.PI * i) / total - Math.PI / 2;
          const rx = isRound ? 52 : 58;
          const ry = isRound ? 52 : 38;
          const cx = 50 + rx * Math.cos(angle);
          const cy = 50 + ry * Math.sin(angle);
          
          return (
            <div
              key={guest.id}
              draggable
              onDragStart={() => onDragStart(guest.id)}
              className="absolute group cursor-grab active:cursor-grabbing"
              style={{
                left: `${cx}%`,
                top: `${cy}%`,
                transform: "translate(-50%, -50%)",
              }}
              title={`${guest.first_name} ${guest.last_name || ""}`}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-[9px] font-body font-medium text-foreground hover:bg-primary/30 transition-colors relative">
                {guest.first_name.charAt(0)}{(guest.last_name || "").charAt(0)}
                <button
                  onClick={(e) => { e.stopPropagation(); onRemoveGuest(guest.id); }}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={7} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Controls below */}
      <div className="flex items-center justify-center gap-2 mt-2">
        <Badge variant={isFull ? "default" : "secondary"} className="text-[10px]">
          {isFull ? "Complète" : `${table.capacity - guests.length} place(s) libre(s)`}
        </Badge>
        <Button variant="ghost" size="icon" className="h-5 w-5" onClick={onRemoveTable}>
          <Trash2 size={10} className="text-destructive" />
        </Button>
      </div>

      {/* Guest list below for readability */}
      {guests.length > 0 && (
        <div className="mt-2 space-y-0.5">
          {guests.map(guest => (
            <div key={guest.id} className="text-[11px] font-body text-muted-foreground text-center">
              {guest.first_name} {guest.last_name || ""}
            </div>
          ))}
        </div>
      )}

      {guests.length === 0 && (
        <p className="text-[10px] text-muted-foreground font-body text-center mt-2 italic">
          Glissez des invités ici
        </p>
      )}
    </div>
  );
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
  const [newTableShape, setNewTableShape] = useState<TableShape>("round");
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const confirmedGuests = guests.filter(g => g.status === "confirmed");

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
          if (saved.tables) setTables(saved.tables.map(t => ({ ...t, shape: t.shape || "round" })));
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
    setTables(prev => [...prev, { id: crypto.randomUUID(), name, capacity: parseInt(newTableCapacity) || 8, shape: newTableShape, guests: [] }]);
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
      const cleaned = prev.map(t => ({ ...t, guests: t.guests.filter(g => g !== draggedGuest) }));
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
      const shapeIcon = table.shape === "round" ? "\u25CB" : "\u25AD";
      return `
        <div style="break-inside:avoid;border:2px solid #c9a96e;border-radius:${table.shape === "round" ? "50%" : "12px"};padding:20px;margin-bottom:16px;background:#fffbf5;text-align:center;">
          <h3 style="margin:0 0 8px;font-family:'Cormorant Garamond',serif;font-size:18px;color:#5c4033;">${shapeIcon} ${table.name}</h3>
          <span style="font-size:11px;color:#8b7355;font-family:'Lora',serif;">${tGuests.length}/${table.capacity} places</span>
          <div style="margin-top:8px;text-align:left;display:grid;grid-template-columns:1fr 1fr;gap:2px;">
            ${tGuests.map(g => `<div style="padding:2px 6px;font-size:12px;font-family:'Lora',serif;color:#3d2b1f;">\u2022 ${g!.first_name} ${g!.last_name || ''}</div>`).join('')}
            ${Array(emptySlots).fill('<div style="padding:2px 6px;font-size:11px;color:#ccc;font-style:italic;">\u2014 libre \u2014</div>').join('')}
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
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;">${tablesHtml}</div>
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
                <div className="w-36">
                  <label className="text-xs text-muted-foreground font-body mb-1 block">Forme</label>
                  <Select value={newTableShape} onValueChange={v => setNewTableShape(v as TableShape)}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round">
                        <span className="flex items-center gap-1.5"><Circle size={12} />Ronde</span>
                      </SelectItem>
                      <SelectItem value="rectangle">
                        <span className="flex items-center gap-1.5"><RectangleHorizontal size={12} />Rectangulaire</span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addTable} className="btn-gold h-9 gap-1"><Plus size={14} />Ajouter</Button>
              </div>

              {/* Tables grid */}
              {tables.length === 0 ? (
                <div className="card-glass p-8 text-center">
                  <p className="text-muted-foreground font-body">Commencez par créer des tables, puis glissez-déposez vos invités.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tables.map(table => {
                    const tableGuests = table.guests.map(id => guestMap.get(id)).filter(Boolean) as RsvpGuest[];
                    const isFull = tableGuests.length >= table.capacity;

                    return (
                      <div key={table.id} className="card-glass p-4">
                        <TableVisual
                          table={table}
                          guests={tableGuests}
                          isDragTarget={!!draggedGuest && !isFull}
                          onDrop={() => handleDrop(table.id)}
                          onDragOver={e => { if (!isFull) e.preventDefault(); }}
                          onRemoveGuest={guestId => removeGuestFromTable(table.id, guestId)}
                          onDragStart={handleDragStart}
                          onRemoveTable={() => removeTable(table.id)}
                        />
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