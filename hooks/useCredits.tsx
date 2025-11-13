"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useCredits(userId?: string | null) {
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchCredits = async () => {
    console.log("🧠 useCredits → userId:", userId);

    if (!userId) {
      setCredits(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching credits:", error);
      setCredits(null);
    } else {
      setCredits(data?.credits ?? 0);
    }

    setLoading(false);
  };

  const decrementCredits = async () => {
    if (!userId) return;

    const { error } = await supabase.rpc("decrement_credits", {
      user_id: userId,
    });

    if (error) {
      console.error("Error decrementing credits:", error);
    } else {
      setCredits((prev) => (prev && prev > 0 ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    fetchCredits();
  }, [userId]);

  return { credits, loading, fetchCredits, decrementCredits };
}
