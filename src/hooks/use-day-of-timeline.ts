import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";

export interface DayOfTimeline {
  id: string;
  user_id: string;
  title: string;
  event_date: string | null;
  share_code: string;
  is_public: boolean;
}

export interface TimelineItem {
  id: string;
  timeline_id: string;
  user_id: string;
  title: string;
  start_time: string;
  end_time: string | null;
  address: string | null;
  google_maps_link: string | null;
  responsible_person: string | null;
  notes: string | null;
  sort_order: number;
}

export function useDayOfTimeline() {
  const { user } = useAuthContext();
  const [timeline, setTimeline] = useState<DayOfTimeline | null>(null);
  const [items, setItems] = useState<TimelineItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTimeline = async () => {
    if (!user) { setTimeline(null); setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data: tl } = await supabase
      .from("day_of_timeline")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    
    if (tl) {
      setTimeline(tl as DayOfTimeline);
      const { data: itms } = await supabase
        .from("day_of_timeline_items")
        .select("*")
        .eq("timeline_id", tl.id)
        .order("start_time", { ascending: true });
      setItems((itms as TimelineItem[]) || []);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTimeline(); }, [user]);

  const createTimeline = async (title: string, event_date?: string) => {
    if (!user) return;
    const { data } = await supabase
      .from("day_of_timeline")
      .insert({ user_id: user.id, title, event_date } as any)
      .select()
      .single();
    if (data) setTimeline(data as DayOfTimeline);
    return data;
  };

  const addItem = async (values: Partial<TimelineItem>) => {
    if (!user || !timeline) return;
    await supabase.from("day_of_timeline_items").insert({
      ...values, timeline_id: timeline.id, user_id: user.id
    } as any);
    fetchTimeline();
  };

  const updateItem = async (id: string, values: Partial<TimelineItem>) => {
    await supabase.from("day_of_timeline_items").update(values).eq("id", id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...values } : i));
  };

  const deleteItem = async (id: string) => {
    await supabase.from("day_of_timeline_items").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
  };

  // Conflict detection
  const hasConflict = (startTime: string, endTime: string | null, excludeId?: string) => {
    if (!endTime) return false;
    return items.some(item => {
      if (item.id === excludeId) return false;
      if (!item.end_time) return false;
      return startTime < item.end_time && endTime > item.start_time;
    });
  };

  return { timeline, items, loading, createTimeline, addItem, updateItem, deleteItem, hasConflict, refetch: fetchTimeline };
}
