
-- Notifications table for in-app wedding reminders
CREATE TABLE public.wedding_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'reminder', -- 'reminder', 'cultural', 'budget', 'vendor'
  icon TEXT DEFAULT '🔔',
  is_read BOOLEAN NOT NULL DEFAULT false,
  action_url TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wedding_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.wedding_notifications FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications"
ON public.wedding_notifications FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own notifications"
ON public.wedding_notifications FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
ON public.wedding_notifications FOR INSERT
WITH CHECK (true);

CREATE INDEX idx_notifications_user_unread ON public.wedding_notifications (user_id, is_read) WHERE is_read = false;

-- Enable realtime for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE public.wedding_notifications;
