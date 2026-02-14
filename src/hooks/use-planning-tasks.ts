import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";

export interface PlanningTask {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  category: string;
  due_date: string | null;
  done: boolean;
  priority: string;
  auto_generated: boolean;
  linked_vendor_id: string | null;
  sort_order: number;
  created_at: string;
}

export function usePlanningTasks() {
  const { user } = useAuthContext();
  const [tasks, setTasks] = useState<PlanningTask[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!user) { setTasks([]); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("planning_tasks")
      .select("*")
      .eq("user_id", user.id)
      .order("due_date", { ascending: true, nullsFirst: false });
    setTasks((data as PlanningTask[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchTasks(); }, [user]);

  const addTask = async (values: Partial<PlanningTask>) => {
    if (!user) return;
    await supabase.from("planning_tasks").insert({ ...values, user_id: user.id } as any);
    fetchTasks();
  };

  const updateTask = async (id: string, values: Partial<PlanningTask>) => {
    await supabase.from("planning_tasks").update(values).eq("id", id);
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...values } : t));
  };

  const deleteTask = async (id: string) => {
    await supabase.from("planning_tasks").delete().eq("id", id);
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return { tasks, loading, addTask, updateTask, deleteTask, refetch: fetchTasks };
}
