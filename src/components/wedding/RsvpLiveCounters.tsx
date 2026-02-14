import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";
import { Users, CheckCircle2, XCircle, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Counts {
  confirmed: number;
  declined: number;
  pending: number;
  companions: number;
}

export function RsvpLiveCounters() {
  const { user } = useAuthContext();
  const [counts, setCounts] = useState<Counts | null>(null);
  const [eventId, setEventId] = useState<string | null>(null);

  // Fetch event ID
  useEffect(() => {
    if (!user) return;
    supabase
      .from("rsvp_events")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => setEventId(data?.id ?? null));
  }, [user]);

  // Fetch counts
  const fetchCounts = async () => {
    if (!eventId) return;
    const { data } = await supabase
      .from("rsvp_guests")
      .select("status, companions")
      .eq("event_id", eventId);
    if (!data) return;
    const confirmed = data.filter(g => g.status === "confirmed");
    setCounts({
      confirmed: confirmed.length,
      declined: data.filter(g => g.status === "declined").length,
      pending: data.filter(g => g.status === "pending").length,
      companions: confirmed.reduce((sum, g) => {
        const c = g.companions as any[] | null;
        return sum + (c?.length || 0);
      }, 0),
    });
  };

  useEffect(() => { fetchCounts(); }, [eventId]);

  // Realtime subscription
  useEffect(() => {
    if (!eventId) return;
    const channel = supabase
      .channel(`rsvp-live-${eventId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "rsvp_guests", filter: `event_id=eq.${eventId}` },
        () => fetchCounts()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  if (!counts || (counts.confirmed === 0 && counts.declined === 0 && counts.pending === 0)) return null;

  const total = counts.confirmed + counts.declined + counts.pending;
  const items = [
    { label: "Confirmés", value: counts.confirmed, icon: CheckCircle2, color: "text-primary" },
    { label: "Déclinés", value: counts.declined, icon: XCircle, color: "text-destructive" },
    { label: "En attente", value: counts.pending, icon: Clock, color: "text-accent" },
    { label: "Total + acc.", value: counts.confirmed + counts.companions, icon: Users, color: "text-foreground" },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
      <h3 className="font-serif text-lg text-chocolate mb-4 flex items-center gap-2">
        <Users size={18} className="text-primary" /> RSVP
        <span className="font-body text-xs text-muted-foreground font-normal">({total} invité{total > 1 ? "s" : ""})</span>
        <span className="relative flex h-2 w-2 ml-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
        </span>
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {items.map((item) => (
          <div key={item.label} className="card-premium p-4 text-center">
            <item.icon size={18} className={`${item.color} mx-auto mb-1`} />
            <p className="font-body text-xs text-muted-foreground">{item.label}</p>
            <AnimatePresence mode="wait">
              <motion.p
                key={item.value}
                initial={{ scale: 1.3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className={`font-serif text-2xl ${item.color}`}
              >
                {item.value}
              </motion.p>
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
