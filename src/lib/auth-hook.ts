import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function refresh(uid: string | null) {
      if (!uid) {
        if (!cancelled) { setUserId(null); setIsAdmin(false); setLoading(false); }
        return;
      }
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", uid).eq("role", "admin").maybeSingle();
      if (!cancelled) { setUserId(uid); setIsAdmin(!!data); setLoading(false); }
    }

    supabase.auth.getUser().then(({ data }) => refresh(data.user?.id ?? null));

    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        refresh(session?.user?.id ?? null);
      }
    });

    return () => { cancelled = true; sub.subscription.unsubscribe(); };
  }, []);

  return { userId, isAdmin, loading };
}
