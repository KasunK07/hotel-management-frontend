export interface ApiEnvelope<T> {
  status: number;
  message: string;
  data: T;
}

export class ApiError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function sessionToken(): string | undefined {
  try {
    const value = localStorage.getItem("meridian-session");
    return value ? (JSON.parse(value) as { token?: string }).token : undefined;
  } catch {
    return undefined;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;
  const token = sessionToken();
  try {
    response = await fetch(`/api/v1${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
  } catch {
    throw new ApiError("Cannot reach the server. Check that the backend is running.", 0);
  }
  const payload = (await response.json().catch(() => ({}))) as Partial<ApiEnvelope<T>>;
  if (!response.ok) {
    throw new ApiError(payload.message || `Request failed (${response.status})`, response.status);
  }
  return payload.data as T;
}

export function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Something went wrong. Please try again.";
}
