import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// ENDPOINT TEMPORAIRE — à supprimer après usage
export async function GET() {
  const supabase = createAdminClient();

  // Test: lister les users pour vérifier que l'admin client fonctionne
  const { data: list, error: listErr } = await supabase.auth.admin.listUsers();
  if (listErr) {
    return NextResponse.json({ step: "listUsers", error: listErr.message, status: listErr.status }, { status: 500 });
  }

  const user = list.users.find(u => u.email === "diopmassamba78@gmail.com");
  if (!user) {
    return NextResponse.json({ step: "findUser", error: "User not found", emails: list.users.map(u => u.email) });
  }

  // Appel REST direct pour voir l'erreur complète
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/admin/users/${user.id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: "Education2019." }),
    }
  );
  const body = await res.json();
  if (!res.ok) {
    return NextResponse.json({ step: "restUpdate", status: res.status, body }, { status: 500 });
  }

  return NextResponse.json({ ok: true, message: "Mot de passe mis à jour", userId: user.id });
}
