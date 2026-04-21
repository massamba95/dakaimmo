import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: membership } = await supabase
    .from("memberships")
    .select("org_id")
    .eq("user_id", user.id)
    .eq("status", "ACTIVE")
    .limit(1)
    .maybeSingle();

  if (!membership) return NextResponse.json({ openIssues: 0, latePayments: 0 });

  const [issuesRes, paymentsRes] = await Promise.all([
    supabase
      .from("issues")
      .select("id", { count: "exact", head: true })
      .eq("org_id", membership.org_id)
      .eq("status", "OPEN"),
    supabase
      .from("payments")
      .select("id", { count: "exact", head: true })
      .eq("status", "LATE"),
  ]);

  return NextResponse.json({
    openIssues: issuesRes.count ?? 0,
    latePayments: paymentsRes.count ?? 0,
  });
}
