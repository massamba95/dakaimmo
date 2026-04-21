import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Retourne le locataire lié au compte connecté.
// Si pas encore lié (user_id null), cherche par email et lie automatiquement.
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  // 1. Chercher par user_id (cas normal)
  const { data: tenantByUid } = await supabase
    .from("tenants")
    .select("id, first_name, last_name")
    .eq("user_id", user.id)
    .limit(1)
    .maybeSingle();

  if (tenantByUid) {
    return NextResponse.json(tenantByUid);
  }

  // 2. Fallback : chercher par email via admin et lier automatiquement
  if (!user.email) {
    return NextResponse.json(null);
  }

  const admin = createAdminClient();

  const { data: tenantByEmail } = await admin
    .from("tenants")
    .select("id, first_name, last_name, user_id")
    .ilike("email", user.email)
    .limit(1)
    .maybeSingle();

  if (!tenantByEmail) {
    return NextResponse.json(null);
  }

  // Lier le compte auth au locataire
  await admin
    .from("tenants")
    .update({ user_id: user.id, invited_at: new Date().toISOString() })
    .eq("id", tenantByEmail.id);

  return NextResponse.json({
    id: tenantByEmail.id,
    first_name: tenantByEmail.first_name,
    last_name: tenantByEmail.last_name,
  });
}
