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

  const { data: orgs } = await admin
    .from("organizations")
    .select("*")
    .order("created_at", { ascending: false });

  if (!orgs || orgs.length === 0) return NextResponse.json([]);

  const orgIds = orgs.map((o) => o.id);

  const [membershipsRes, propertiesRes, subsRes, adminsRes] = await Promise.all([
    admin.from("memberships").select("org_id").in("org_id", orgIds).eq("status", "ACTIVE"),
    admin.from("properties").select("org_id").in("org_id", orgIds),
    admin.from("subscriptions")
      .select("org_id, current_period_end")
      .in("org_id", orgIds)
      .eq("status", "ACTIVE")
      .order("current_period_end", { ascending: false }),
    admin.from("memberships")
      .select("org_id, created_at, profiles:user_id(id, email, first_name, last_name, phone, address)")
      .in("org_id", orgIds)
      .eq("role", "ADMIN")
      .eq("status", "ACTIVE")
      .order("created_at", { ascending: true }),
  ]);

  const memberCounts = (membershipsRes.data ?? []).reduce((acc: Record<string, number>, m) => {
    acc[m.org_id] = (acc[m.org_id] ?? 0) + 1;
    return acc;
  }, {});

  const propCounts = (propertiesRes.data ?? []).reduce((acc: Record<string, number>, p) => {
    acc[p.org_id] = (acc[p.org_id] ?? 0) + 1;
    return acc;
  }, {});

  // Garder uniquement la subscription la plus récente par org
  const subsByOrg = (subsRes.data ?? []).reduce((acc: Record<string, string>, s) => {
    if (!acc[s.org_id]) acc[s.org_id] = s.current_period_end;
    return acc;
  }, {});

  // Premier ADMIN = propriétaire (créateur de l'org)
  type Profile = { id: string; email: string | null; first_name: string | null; last_name: string | null; phone: string | null; address: string | null };
  type AdminRow = { org_id: string; profiles: Profile | Profile[] | null };
  const ownersByOrg = (adminsRes.data as AdminRow[] ?? []).reduce((acc: Record<string, Profile>, m) => {
    const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
    if (!acc[m.org_id] && profile) acc[m.org_id] = profile;
    return acc;
  }, {});

  return NextResponse.json(
    orgs.map((o) => ({
      ...o,
      member_count: memberCounts[o.id] ?? 0,
      property_count: propCounts[o.id] ?? 0,
      subscription_end: subsByOrg[o.id] ?? null,
      owner: ownersByOrg[o.id] ?? null,
    }))
  );
}
