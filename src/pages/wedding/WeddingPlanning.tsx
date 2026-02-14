import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { usePlanningTasks } from "@/hooks/use-planning-tasks";
import { useWeddingProfile } from "@/hooks/use-wedding-profile";
import { useAuthContext } from "@/contexts/auth-context";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Plus, Trash2, CalendarDays, Filter, RefreshCw, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useToast } from "@/hooks/use-toast";

const CATEGORIES = ["general", "budget", "lieu", "traiteur", "photo", "musique", "papeterie", "tenues", "decoration", "organisation", "invites", "tradition", "ceremonie"];

export default function WeddingPlanning() {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { tasks, loading, addTask, updateTask, deleteTask, refetch } = usePlanningTasks();
  const { generateTasks } = useWeddingProfile();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState<Date | undefined>();
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  if (!user) { navigate("/auth"); return null; }

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask({ title, due_date: dueDate?.toISOString().split("T")[0] || null, priority, category });
    toast({ title: "Tâche ajoutée" });
    setTitle(""); setDueDate(undefined); setPriority("medium"); setCategory("general");
  };

  const handleRegenerate = async () => {
    await generateTasks();
    await refetch();
    toast({ title: "Planning régénéré selon votre profil !" });
  };

  const filtered = tasks.filter(t => {
    if (filterCategory !== "all" && t.category !== filterCategory) return false;
    if (filterStatus === "done" && !t.done) return false;
    if (filterStatus === "todo" && t.done) return false;
    return true;
  });

  const priorityColor = (p: string) => {
    switch (p) {
      case "urgent": return "bg-destructive";
      case "high": return "bg-primary";
      case "medium": return "bg-champagne-light";
      default: return "bg-muted-foreground/30";
    }
  };

  return (
    <Layout>
      <section className="pt-28 pb-8 bg-gradient-warm">
        <div className="container-editorial">
          <Link to="/mon-mariage" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-body flex items-center gap-1 mb-2">
            <ArrowLeft size={14} /> Tableau de bord
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="font-serif text-chocolate text-3xl md:text-4xl">Planning</h1>
            <Button variant="outline" size="sm" onClick={handleRegenerate} className="font-body text-xs">
              <RefreshCw size={14} className="mr-1" /> Régénérer
            </Button>
          </div>
        </div>
      </section>

      <section className="section-padding bg-gradient-warm !py-8 md:!py-12">
        <div className="container-editorial max-w-4xl space-y-6">

          {/* Add task */}
          <div className="card-premium p-4 md:p-6 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Input placeholder="Nouvelle tâche..." value={title} onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAdd()} />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start font-body text-sm">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "d MMM yyyy", { locale: fr }) : "Échéance"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0"><Calendar mode="single" selected={dueDate} onSelect={setDueDate} /></PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Basse</SelectItem>
                  <SelectItem value="medium">Moyenne</SelectItem>
                  <SelectItem value="high">Haute</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="text-sm"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button onClick={handleAdd} className="btn-gold text-sm"><Plus size={14} className="mr-1" />Ajouter</Button>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <Filter size={14} className="text-muted-foreground" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-auto text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-auto text-xs h-8"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="todo">À faire</SelectItem>
                <SelectItem value="done">Terminé</SelectItem>
              </SelectContent>
            </Select>
            <span className="font-body text-xs text-muted-foreground ml-auto">{filtered.length} tâche{filtered.length > 1 ? "s" : ""}</span>
          </div>

          {/* Task list */}
          {loading ? (
            <p className="text-muted-foreground font-body text-center py-8">Chargement...</p>
          ) : filtered.length === 0 ? (
            <p className="text-muted-foreground font-body text-center py-8">Aucune tâche</p>
          ) : (
            <div className="space-y-2">
              {filtered.map(task => (
                <motion.div key={task.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="card-premium p-4 flex items-center gap-3">
                  <Checkbox checked={task.done} onCheckedChange={v => updateTask(task.id, { done: !!v })} />
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 ${priorityColor(task.priority)}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`font-body text-sm ${task.done ? "line-through text-muted-foreground" : "text-foreground"}`}>{task.title}</p>
                    <div className="flex gap-2 text-xs text-muted-foreground font-body mt-0.5">
                      {task.due_date && <span>{format(new Date(task.due_date), "d MMM", { locale: fr })}</span>}
                      <span className="capitalize">{task.category}</span>
                      {task.auto_generated && <span className="text-primary">Auto</span>}
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => deleteTask(task.id)}>
                    <Trash2 size={14} className="text-destructive" />
                  </Button>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
