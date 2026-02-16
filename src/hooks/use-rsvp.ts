import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";

export interface RsvpEvent {
  id: string;
  user_id: string;
  title: string;
  event_date: string | null;
  event_location: string | null;
  welcome_message: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
}

export interface RsvpGuest {
  id: string;
  event_id: string;
  first_name: string;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  group_name: string;
  max_companions: number;
  status: string;
  companions: { name: string; age_category?: string }[];
  dietary_restrictions: string | null;
  guest_message: string | null;
  responded_at: string | null;
  token: string;
  created_at: string;
}

export function useRsvpEvent() {
  const { user } = useAuthContext();
  const { toast } = useToast();
  const [event, setEvent] = useState<RsvpEvent | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchEvent = useCallback(async () => {
    if (!user) { setEvent(null); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("rsvp_events")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setEvent(data as RsvpEvent | null);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetchEvent(); }, [fetchEvent]);

  const upsertEvent = async (updates: Partial<RsvpEvent>) => {
    if (!user) return null;
    if (event) {
      const { data, error } = await supabase
        .from("rsvp_events")
        .update(updates)
        .eq("id", event.id)
        .select()
        .single();
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        return null;
      }
      setEvent(data as RsvpEvent);
      return data;
    } else {
      const { data, error } = await supabase
        .from("rsvp_events")
        .insert({ user_id: user.id, ...updates })
        .select()
        .single();
      if (error) {
        toast({ title: "Erreur", description: error.message, variant: "destructive" });
        return null;
      }
      setEvent(data as RsvpEvent);
      return data;
    }
  };

  return { event, loading, upsertEvent, refetch: fetchEvent };
}

export function useRsvpGuests(eventId: string | undefined) {
  const { toast } = useToast();
  const [guests, setGuests] = useState<RsvpGuest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGuests = useCallback(async () => {
    if (!eventId) { setGuests([]); setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from("rsvp_guests")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: true });
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
    } else {
      setGuests((data || []) as unknown as RsvpGuest[]);
    }
    setLoading(false);
  }, [eventId]);

  useEffect(() => { fetchGuests(); }, [fetchGuests]);

  const addGuest = async (guest: Partial<RsvpGuest>) => {
    if (!eventId) return null;
    const { data, error } = await supabase
      .from("rsvp_guests")
      .insert({ event_id: eventId, first_name: guest.first_name || "", last_name: guest.last_name, email: guest.email, phone: guest.phone, group_name: guest.group_name || "Autre", max_companions: guest.max_companions ?? 0 })
      .select()
      .single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return null;
    }
    setGuests(prev => [...prev, data as unknown as RsvpGuest]);
    return data;
  };

  const deleteGuest = async (id: string) => {
    const { error } = await supabase.from("rsvp_guests").delete().eq("id", id);
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return;
    }
    setGuests(prev => prev.filter(g => g.id !== id));
  };

  const updateGuest = async (id: string, updates: Partial<Pick<RsvpGuest, 'first_name' | 'last_name' | 'email' | 'group_name' | 'max_companions'>>) => {
    const { data, error } = await supabase
      .from("rsvp_guests")
      .update(updates)
      .eq("id", id)
      .select()
      .single();
    if (error) {
      toast({ title: "Erreur", description: error.message, variant: "destructive" });
      return null;
    }
    setGuests(prev => prev.map(g => g.id === id ? { ...g, ...data } as unknown as RsvpGuest : g));
    return data;
  };

  const generateLink = async (guestId: string): Promise<string | null> => {
    const session = (await supabase.auth.getSession()).data.session;
    if (!session) return null;
    
    const res = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rsvp-public/generate-link`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${session.access_token}`,
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
        },
        body: JSON.stringify({ guest_id: guestId }),
      }
    );
    const data = await res.json();
    if (data.error) {
      toast({ title: "Erreur", description: data.error, variant: "destructive" });
      return null;
    }
    return data.link;
  };

  return { guests, loading, addGuest, updateGuest, deleteGuest, generateLink, refetch: fetchGuests };
}

// Public API (no auth needed)
export async function verifyRsvpToken(token: string) {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rsvp-public/verify`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ token }),
    }
  );
  return res.json();
}

export async function submitRsvpResponse(token: string, data: {
  status: "confirmed" | "declined";
  companions?: { name: string; age_category?: string }[];
  dietary_restrictions?: string;
  guest_message?: string;
  email?: string;
  phone?: string;
  menu_choice?: string;
}) {
  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/rsvp-public/respond`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY },
      body: JSON.stringify({ token, ...data }),
    }
  );
  return res.json();
}
