
-- Fix: restrict INSERT to service role or own user
DROP POLICY "System can insert notifications" ON public.wedding_notifications;
CREATE POLICY "Users or system can insert notifications"
ON public.wedding_notifications FOR INSERT
WITH CHECK (auth.uid() = user_id);
