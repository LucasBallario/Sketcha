import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useUserProfile(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .single();

      if (error) console.error("Error fetching profile:", error);
      else setProfile(data);

      setLoading(false);
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading };
}
