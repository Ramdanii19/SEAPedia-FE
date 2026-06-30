export const SESSION_KEYS = {
  TOKEN: "token",
  USER: "user",
  ACTIVE_ROLE: "activeRole",
} as const;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEYS.TOKEN);
}

export function getActiveRole(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEYS.ACTIVE_ROLE);
}

// Clears localStorage only — call from apiClient on 401.
// AuthContext.clearSession also resets React state on top of this.
export function clearStorageSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEYS.TOKEN);
  localStorage.removeItem(SESSION_KEYS.USER);
  localStorage.removeItem(SESSION_KEYS.ACTIVE_ROLE);
}
