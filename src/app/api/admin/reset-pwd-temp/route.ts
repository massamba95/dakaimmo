import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ENDPOINT TEMPORAIRE — à supprimer après usage
export async function GET() {
  const supabase = createAdminClient();
  const { error } = await supabase.auth.admin.updateUserById(
    "c3c65c82-9529-4a9b-bdb6-3908d0c1d049",
    { password: "Education2019." }
  );

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Mot de passe mis à jour" });
}
