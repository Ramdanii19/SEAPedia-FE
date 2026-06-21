import { ApiError } from "@/types/common.types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type Options = {
  auth?: boolean;
};

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  { auth = true }: Options = {}
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (auth) {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = await res.json();

  if (!res.ok) {
    const err: ApiError = {
      success: false,
      message: json?.message ?? "Terjadi kesalahan",
      errors: json?.errors,
    };
    throw err;
  }

  return json as T;
}

const apiClient = {
  get: <T>(path: string, options?: Options) =>
    request<T>("GET", path, undefined, options),

  post: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>("POST", path, body, options),

  patch: <T>(path: string, body?: unknown, options?: Options) =>
    request<T>("PATCH", path, body, options),

  delete: <T>(path: string, options?: Options) =>
    request<T>("DELETE", path, undefined, options),
};

export default apiClient;
