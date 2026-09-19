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

export interface SafeParseResult<T = any> {
  data: T;
  error?: string;
  is404?: boolean;
  isProxyError?: boolean;
}

export async function parseResponseSafely<T = any>(
  response: Response,
  fallback: T = {} as T
): Promise<SafeParseResult<T>> {
  const is404 = response.status === 404;

  try {
    const contentType = response.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const parsed = await response.json();
      return { 
        data: parsed, 
        error: parsed?.error,
        is404
      };
    }

    // Response is HTML or plain text (e.g., 404/500 proxy error, Vercel/Cloudflare edge page)
    const text = await response.text();
    const isEdgeProxyPage = text.includes('NOT_FOUND') || text.includes('The page could not be found') || text.includes('cpt1::') || text.includes('Deployment Not Found');

    let cleanText = text.replace(/<[^>]*>?/gm, '').trim();
    if (isEdgeProxyPage || is404) {
      cleanText = 'Service endpoint not found or backend initializing';
    } else {
      cleanText = cleanText.slice(0, 100);
    }

    return {
      data: fallback,
      is404,
      isProxyError: isEdgeProxyPage,
      error: response.ok 
        ? 'Unexpected non-JSON response from server.' 
        : `Server error (${response.status}): ${cleanText}`
    };
  } catch (err: any) {
    return {
      data: fallback,
      is404,
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
