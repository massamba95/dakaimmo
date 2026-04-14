import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: sa } = await supabase
    .from("super_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .single();
  if (!sa) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const admin = createAdminClient();

  const [orgsRes, membersRes, propsRes, subsRes] = await Promise.all([
    admin.from("organizations").select("status"),
    admin.from("memberships").select("*", { count: "exact", head: true }).eq("status", "ACTIVE"),
    admin.from("properties").select("*", { count: "exact", head: true }),
    admin.from("subscriptions").select("amount").eq("status", "ACTIVE"),
  ]);

  const orgs = orgsRes.data ?? [];
  const byStatus = orgs.reduce((acc: Record<string, number>, o) => {
    acc[o.status] = (acc[o.status] ?? 0) + 1;
    return acc;
  }, {});

  const revenue = (subsRes.data ?? []).reduce((sum, s) => sum + (s.amount ?? 0), 0);

  return NextResponse.json({
    totalOrgs: orgs.length,
    activeOrgs: byStatus["ACTIVE"] ?? 0,
    trialOrgs: byStatus["TRIAL"] ?? 0,
    blockedOrgs: byStatus["BLOCKED"] ?? 0,
    cancelledOrgs: byStatus["CANCELLED"] ?? 0,
    totalMembers: membersRes.count ?? 0,
    totalProperties: propsRes.count ?? 0,
    monthlyRevenue: revenue,
  });
}
