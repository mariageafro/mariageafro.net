import { supabase } from "@/integrations/supabase/client";

export async function logAdminAction(
  action: string,
  targetTable?: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  await (supabase as any).from("admin_logs").insert({
    admin_id: user.id,
    action,
    target_table: targetTable,
    target_id: targetId,
    details,
  });
}
