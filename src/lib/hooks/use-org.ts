"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface OrgData {
  orgId: string | null;
  orgName: string | null;
  orgPlan: string | null;
  orgStatus: string | null;
  role: string | null;
  userId: string | null;
  loading: boolean;
}

export function useOrg(): OrgData {
  const [data, setData] = useState<OrgData>({
    orgId: null,
    orgName: null,
    orgPlan: null,
    orgStatus: null,
    role: null,
    userId: null,
    loading: true,
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setData((prev) => ({ ...prev, loading: false }));
        return;
      }

      const { data: membership } = await supabase
        .from("memberships")
        .select("org_id, role, organizations(name, plan, status)")
        .eq("user_id", user.id)
        .single();

      if (membership) {
        const org = membership.organizations as unknown as Record<string, string> | null;
        setData({
          orgId: membership.org_id,
          orgName: org?.name ?? null,
          orgPlan: org?.plan ?? null,
          orgStatus: org?.status ?? null,
          role: membership.role,
          userId: user.id,
          loading: false,
        });
      } else {
        setData((prev) => ({ ...prev, userId: user.id, loading: false }));
      }
    }
    load();
  }, []);

  return data;
}
