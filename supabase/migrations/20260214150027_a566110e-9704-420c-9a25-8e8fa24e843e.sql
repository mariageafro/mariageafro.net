
-- =============================================
-- RSVP SYSTEM: Tables + RLS + Triggers
-- =============================================

-- RSVP Events (one per user/wedding)
CREATE TABLE public.rsvp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL DEFAULT 'Notre Mariage',
  event_date DATE,
  event_location TEXT,
  welcome_message TEXT,
  deadline DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RSVP Guests
CREATE TABLE public.rsvp_guests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES public.rsvp_events(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  group_name TEXT DEFAULT 'Autre',
  max_companions INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pending',
  companions JSONB DEFAULT '[]'::jsonb,
  dietary_restrictions TEXT,
  guest_message TEXT,
  responded_at TIMESTAMPTZ,
  token TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes
CREATE INDEX idx_rsvp_events_user ON public.rsvp_events(user_id);
CREATE INDEX idx_rsvp_guests_event ON public.rsvp_guests(event_id);
CREATE INDEX idx_rsvp_guests_token ON public.rsvp_guests(token);
CREATE INDEX idx_rsvp_guests_status ON public.rsvp_guests(status);

-- Enable RLS
ALTER TABLE public.rsvp_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_guests ENABLE ROW LEVEL SECURITY;

-- RLS Policies for rsvp_events
CREATE POLICY "Users can view their own events"
  ON public.rsvp_events FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON public.rsvp_events FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON public.rsvp_events FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.rsvp_events FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for rsvp_guests (owner access)
CREATE POLICY "Event owners can view their guests"
  ON public.rsvp_guests FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events
      WHERE id = rsvp_guests.event_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can insert guests"
  ON public.rsvp_guests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.rsvp_events
      WHERE id = rsvp_guests.event_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can update guests"
  ON public.rsvp_guests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events
      WHERE id = rsvp_guests.event_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Event owners can delete guests"
  ON public.rsvp_guests FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.rsvp_events
      WHERE id = rsvp_guests.event_id AND user_id = auth.uid()
    )
  );

-- Public access for guest responses (via service role in edge function)
-- The edge function validates JWT tokens and uses service role to read/write

-- Triggers for updated_at
CREATE TRIGGER update_rsvp_events_updated_at
  BEFORE UPDATE ON public.rsvp_events
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_rsvp_guests_updated_at
  BEFORE UPDATE ON public.rsvp_guests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
