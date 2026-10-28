export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/** Same-origin call to the Express backend (proxied by Next.js). The login cookie is sent automatically. */
export async function api<T = unknown>(path: string, init: RequestInit = {}): Promise<T> {
  const isForm = typeof FormData !== "undefined" && init.body instanceof FormData;
  const res = await fetch(`/api/admin${path}`, {
    ...init,
    credentials: "same-origin",
    // For FormData the browser must set the multipart boundary itself.
    headers: isForm ? { ...(init.headers || {}) } : { "Content-Type": "application/json", ...(init.headers || {}) },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(body.message || "Request failed.", res.status);
  return body as T;
}
