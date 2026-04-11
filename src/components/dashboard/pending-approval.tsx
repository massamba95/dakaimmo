"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, LogOut } from "lucide-react";

interface PendingApprovalProps {
  orgName: string | null;
}

export function PendingApproval({ orgName }: PendingApprovalProps) {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <Clock className="h-16 w-16 text-yellow-500" />
          <h2 className="mt-6 text-2xl font-bold text-center">En attente d&apos;approbation</h2>
          <p className="mt-3 text-muted-foreground text-center">
            Votre demande pour rejoindre <strong>{orgName}</strong> est en cours de validation.
          </p>
          <p className="mt-2 text-sm text-muted-foreground text-center">
            L&apos;administrateur doit approuver votre demande. Vous serez notifie une fois accepte.
          </p>
          <Button variant="outline" className="mt-8" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Se deconnecter
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
