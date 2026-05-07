import { supabase } from "@/integrations/supabase/client";

export async function logAudit(action: {
  action_type: "CREATE" | "UPDATE" | "DELETE" | "ROLE_CHANGE" | "LOGIN";
  resource_type: string;
  resource_name?: string;
  details?: any;
}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("audit_logs").insert([
    {
      user_id: user.id,
      ...action,
    },
  ]);
}
