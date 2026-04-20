import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createAdminClient();
  const today = new Date().toISOString().split("T")[0];

  const { data: expired } = await admin
    .from("subscriptions")
    .select("id, org_id")
    .eq("status", "ACTIVE")
    .lt("current_period_end", today);

  if (!expired || expired.length === 0) {
    return NextResponse.json({ ok: true, expired: 0 });
  }

  for (const sub of expired) {
    await admin
      .from("subscriptions")
      .update({ status: "PAST_DUE" })
      .eq("id", sub.id);

    await admin
      .from("organizations")
      .update({ plan: "FREE", max_properties: 1, max_members: 1 })
      .eq("id", sub.org_id);
  }

  return NextResponse.json({ ok: true, expired: expired.length });
}
