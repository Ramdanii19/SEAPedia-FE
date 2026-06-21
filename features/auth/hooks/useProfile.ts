"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user, isLoading, refreshMe } = useAuth();

  useEffect(() => {
    refreshMe();
  }, [refreshMe]);

  return { user, isLoading };
}
