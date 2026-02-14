import { supabase } from "@/integrations/supabase/client";

export async function logAdminAction(
  action: string,
  targetTable?: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // Check admin role before attempting insert to avoid silent RLS failures
  const { data: roleData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .eq("role", "admin")
    .maybeSingle();

  if (!roleData) {
    console.warn("logAdminAction called by non-admin user, skipping.");
    return;
  }

  const { error } = await (supabase as any).from("admin_logs").insert({
    admin_id: user.id,
    action,
    target_table: targetTable,
    target_id: targetId,
    details,
  });

  if (error) {
    console.error("Failed to log admin action:", error.message);
  }
}
