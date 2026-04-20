import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { email } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: "https://jappaleimmo.com/reset-password",
  });

  if (error) {
    console.error("[request-reset] error:", error.message, "email:", email);
  } else {
    console.log("[request-reset] recovery email sent to:", email);
  }

  return NextResponse.json({ ok: true });
}
