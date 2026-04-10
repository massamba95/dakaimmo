"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface DeleteButtonProps {
  table: string;
  id: string;
  label: string;
  redirectTo: string;
  onPropertyDelete?: string; // property_id to set back to AVAILABLE
}

export function DeleteButton({ table, id, label, redirectTo, onPropertyDelete }: DeleteButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirming) {
      setConfirming(true);
      return;
    }

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from(table).delete().eq("id", id);

    if (error) {
      toast.error(`Erreur lors de la suppression.`);
      console.error(error);
      setLoading(false);
      setConfirming(false);
      return;
    }

    if (onPropertyDelete) {
      await supabase
        .from("properties")
        .update({ status: "AVAILABLE" })
        .eq("id", onPropertyDelete);
    }

    toast.success(`${label} supprime avec succes.`);
    router.push(redirectTo);
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      {confirming && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => setConfirming(false)}
          disabled={loading}
        >
          Annuler
        </Button>
      )}
      <Button
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={loading}
      >
        <Trash2 className="h-4 w-4 mr-1" />
        {loading ? "Suppression..." : confirming ? "Confirmer" : "Supprimer"}
      </Button>
    </div>
  );
}
