import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlanLimits } from "@/lib/plans";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sa } = await supabase
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!sa) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await request.json() as { status?: string; plan?: string };
  const admin = createAdminClient();

  const update: Record<string, unknown> = {};

  if (body.status) {
    update.status = body.status;
    if (body.status === "BLOCKED") update.blocked_at = new Date().toISOString();
    if (body.status === "ACTIVE") update.blocked_at = null;
  }

  if (body.plan) {
    const limits = getPlanLimits(body.plan);
    update.plan = body.plan;
    update.max_properties = limits.maxProperties;
    update.max_members = limits.maxMembers;
  }

  const { error } = await admin
    .from("organizations")
    .update(update)
    .eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
