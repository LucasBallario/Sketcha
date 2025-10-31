"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export function useCredits(userId) {
  const [credits, setCredits] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async () => {
    if (!userId) return;
    setLoading(true);

    const { data, error } = await supabase
      .from("profiles")
      .select("credits")
      .eq("id", userId)
      .single();

    if (error) console.error("Error fetching credits:", error);
    setCredits(data?.credits ?? 0);
    setLoading(false);
  };

  // Descontar 1 crédito
  const decrementCredits = async () => {
    if (!userId) return;

    const { data, error } = await supabase.rpc("decrement_credits", {
      user_id: userId,
    });

    if (error) {
      console.error("Error decrementing credits:", error);
    } else {
      setCredits((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  useEffect(() => {
    if (!userId) return;
    console.log("🧩 useCredits → userId recibido:", userId);
    fetchCredits();
  }, [userId]);

  return { credits, loading, fetchCredits, decrementCredits };
}
