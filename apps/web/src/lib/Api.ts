const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
  pagination?: PaginationMeta;
}

interface ApiFailure {
  success: false;
  message: string | string[];
  statusCode: number;
  timestamp: string;
}

type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

/**
 * Thrown for both transport failures and `{ success: false }` responses, so
 * callers (and React Query's error state) only ever deal with one error type.
 */
export class ApiError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
  }
}

export interface Paginated<T> {
  data: T[];
  pagination: PaginationMeta;
}

/**
 * Not every apps/api endpoint uses the `{success, data}` envelope: list
 * endpoints (`GET /jobs`, `GET /applications`) do, via `paginate()`, but
 * single-resource endpoints (`GET/POST/PATCH /applications/:id`,
 * `POST /jobs/:id/apply`) return the row directly with no `success` field —
 * an explicit, intentional split (see BACKEND_GUIDELINES.md/HANDOFF.md), not
 * an inconsistency to "fix" on the frontend. A body only counts as the
 * failure shape if `success` is LITERALLY `false` — a raw resource object
 * has no `success` key at all (`undefined`), which must be treated as a
 * normal successful body, not coerced into `!body.success` and thrown as an
 * error (that bug silently rolled back every successful status-change and
 * apply-to-job mutation, since Nest's global exception filter never even
 * ran — the request succeeded, this client just misread the response).
 */
function isFailureBody(body: unknown): body is ApiFailure {
  return (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === false
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new ApiError(`Network error reaching API: ${message}`, 0);
  }

  const body = (await response.json()) as ApiResponse<T> | T;

  if (isFailureBody(body)) {
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;
    throw new ApiError(message, body.statusCode);
  }

  if (
    typeof body === "object" &&
    body !== null &&
    "success" in body &&
    (body as { success: unknown }).success === true
  ) {
    return (body as ApiSuccess<T>).data;
  }

  return body as T;
}

/** For list endpoints returning `{ success, data, pagination }`. */
async function requestPaginated<T>(
  path: string,
  init?: RequestInit,
): Promise<Paginated<T>> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init?.headers,
      },
    });
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    throw new ApiError(`Network error reaching API: ${message}`, 0);
  }

  const body = (await response.json()) as ApiResponse<T[]>;

  if (!body.success) {
    const message = Array.isArray(body.message)
      ? body.message.join(", ")
      : body.message;
    throw new ApiError(message, body.statusCode);
  }

  return { data: body.data, pagination: body.pagination! };
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  getPaginated: <T>(path: string) => requestPaginated<T>(path),
  post: <T>(path: string, json?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: json !== undefined ? JSON.stringify(json) : undefined,
    }),
  patch: <T>(path: string, json?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: json !== undefined ? JSON.stringify(json) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
