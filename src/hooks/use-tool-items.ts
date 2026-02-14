import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export interface ToolItem {
  id: string;
  user_id: string;
  tool_slug: string;
  title: string;
  amount: number | null;
  date: string | null;
  done: boolean;
  meta: Record<string, any>;
  created_at: string;
}

export function useToolItems(toolSlug: string) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [items, setItems] = useState<ToolItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    if (!user) { setItems([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("user_tool_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("tool_slug", toolSlug)
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setItems((data as ToolItem[]) || []);
    }
    setLoading(false);
  }, [user, toolSlug]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async (item: Partial<ToolItem>) => {
    if (!user) return null;
    const { data, error } = await supabase
      .from("user_tool_items")
      .insert({ user_id: user.id, tool_slug: toolSlug, title: item.title || "", amount: item.amount, date: item.date, done: item.done ?? false, meta: item.meta ?? {} })
      .select()
      .single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return null;
    }
    setItems(prev => [...prev, data as ToolItem]);
    return data;
  };

  const updateItem = async (id: string, updates: Partial<ToolItem>) => {
    const { error } = await supabase
      .from("user_tool_items")
      .update(updates)
      .eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setItems(prev => prev.map(i => i.id === id ? { ...i, ...updates } : i));
  };

  const deleteItem = async (id: string) => {
    const { error } = await supabase
      .from("user_tool_items")
      .delete()
      .eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setItems(prev => prev.filter(i => i.id !== id));
  };

  return { items, loading, addItem, updateItem, deleteItem, refetch: fetchItems };
}

export function useToolData(toolSlug: string) {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { setData({}); setLoading(false); return; }
    (async () => {
      const { data: row, error } = await supabase
        .from("user_tools")
        .select("*")
        .eq("user_id", user.id)
        .eq("tool_slug", toolSlug)
        .maybeSingle();
      if (!error && row) setData((row as any).data || {});
      setLoading(false);
    })();
  }, [user, toolSlug]);

  const saveData = async (newData: Record<string, any>) => {
    if (!user) return;
    const merged = { ...data, ...newData };
    const { error } = await supabase
      .from("user_tools")
      .upsert({ user_id: user.id, tool_slug: toolSlug, data: merged }, { onConflict: "user_id,tool_slug" });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setData(merged);
  };

  return { data, loading, saveData };
}
