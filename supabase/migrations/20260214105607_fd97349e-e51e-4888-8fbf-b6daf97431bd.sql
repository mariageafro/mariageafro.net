
-- Table for per-tool metadata (e.g. budget target)
CREATE TABLE public.user_tools (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  data jsonb DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_user_tools_unique ON public.user_tools (user_id, tool_slug);

ALTER TABLE public.user_tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own tools" ON public.user_tools FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tools" ON public.user_tools FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tools" ON public.user_tools FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tools" ON public.user_tools FOR DELETE USING (auth.uid() = user_id);

-- Table for individual tool items (checklist tasks, budget items, etc.)
CREATE TABLE public.user_tool_items (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  tool_slug text NOT NULL,
  title text NOT NULL,
  amount numeric,
  date timestamptz,
  done boolean NOT NULL DEFAULT false,
  meta jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_tool_items_user ON public.user_tool_items (user_id, tool_slug);

ALTER TABLE public.user_tool_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own items" ON public.user_tool_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own items" ON public.user_tool_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own items" ON public.user_tool_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own items" ON public.user_tool_items FOR DELETE USING (auth.uid() = user_id);

-- Trigger for updated_at on user_tools
CREATE TRIGGER update_user_tools_updated_at
  BEFORE UPDATE ON public.user_tools
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
