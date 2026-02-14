import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";

export interface WeddingProfile {
  id: string;
  user_id: string;
  wedding_date: string | null;
  city: string | null;
  country: string | null;
  partner_one_first_name: string;
  partner_two_first_name: string;
  partner_one_last_name: string | null;
  partner_two_last_name: string | null;
  couple_display_name: string | null;
  couple_quote: string | null;
  origin_partner_one: string | null;
  origin_partner_two: string | null;
  wedding_type: string;
  guest_count: number;
  estimated_budget: number;
  wedding_style: string;
  is_afro_wedding: boolean;
  onboarding_completed: boolean;
}

export function useWeddingProfile() {
  const { user } = useAuthContext();
  const [profile, setProfile] = useState<WeddingProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    if (!user) { setProfile(null); setLoading(false); return; }
    setLoading(true);
    const { data } = await supabase
      .from("user_wedding_profile")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    setProfile(data as WeddingProfile | null);
    setLoading(false);
  };

  useEffect(() => { fetchProfile(); }, [user]);

  const saveProfile = async (values: Partial<WeddingProfile>) => {
    if (!user) return;
    const payload = { ...values, user_id: user.id };
    
    if (profile) {
      const { data, error } = await supabase
        .from("user_wedding_profile")
        .update(payload)
        .eq("user_id", user.id)
        .select()
        .single();
      if (!error && data) setProfile(data as WeddingProfile);
      return { data, error };
    } else {
      const { data, error } = await supabase
        .from("user_wedding_profile")
        .insert(payload as any)
        .select()
        .single();
      if (!error && data) setProfile(data as WeddingProfile);
      return { data, error };
    }
  };

  const generateTasks = async () => {
    if (!user) return;
    await supabase.rpc("generate_planning_tasks", { _user_id: user.id });
  };

  return { profile, loading, saveProfile, generateTasks, refetch: fetchProfile };
}
