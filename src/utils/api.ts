/**
 * Utility functions for robust network requests and error-safe JSON parsing.
 * Prevents "Unexpected token ..., is not valid JSON" errors by checking Content-Type
 * and handling non-JSON error pages (HTML/plain text) gracefully.
 */

export interface SafeApiResponse<T = any> {
  ok: boolean;
  status: number;
  data: T;
  error?: string;
}

export async function parseResponseSafely<T = any>(
  response: Response,
  fallback: T = {} as T
): Promise<{ data: T; error?: string }> {
  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const parsed = await response.json();
      return { data: parsed, error: parsed?.error };
    }

    // Response is HTML or plain text (e.g., 404/500 proxy error)
    const text = await response.text();
    const cleanText = text.replace(/<[^>]*>?/gm, '').trim().slice(0, 120);
    return {
      data: fallback,
      error: response.ok 
        ? 'Unexpected non-JSON response from server.' 
        : `Server error (${response.status}): ${cleanText || 'Service unavailable'}`
    };
  } catch (err: any) {
    return {
      data: fallback,
      error: err?.message || 'Failed to parse response'
    };
  }
}

export async function safeFetchJson<T = any>(
  input: RequestInfo | URL,
  init?: RequestInit,
  fallback: T = {} as T
): Promise<SafeApiResponse<T>> {
  try {
    const res = await fetch(input, init);
    const { data, error } = await parseResponseSafely<T>(res, fallback);

    if (!res.ok) {
      return {
        ok: false,
        status: res.status,
        data: data || fallback,
        error: error || (data as any)?.error || (data as any)?.message || `Request failed with status ${res.status}`
      };
    }

    return {
      ok: true,
      status: res.status,
      data: data || fallback,
      error
    };
  } catch (netErr: any) {
    return {
      ok: false,
      status: 0,
      data: fallback,
      error: netErr?.message || 'Network connection failed'
    };
  }
}
