import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { catchError, retry, tap, timeout } from 'rxjs/operators';

const CACHE_KEY_PREFIX = 'http-cache:';
const REQUEST_TIMEOUT_MS = 8000;
const RETRY_COUNT = 2;
const RETRY_DELAY_MS = 300;

export const CACHE_DATE_HEADER = 'x-cache-date';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

function cacheKeyFor(url: string): string {
  return `${CACHE_KEY_PREFIX}${url}`;
}

function readCache<T>(url: string): CacheEntry<T> | null {
  try {
    const raw = localStorage.getItem(cacheKeyFor(url));
    return raw ? (JSON.parse(raw) as CacheEntry<T>) : null;
  } catch {
    return null;
  }
}

function writeCache<T>(url: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, timestamp: Date.now() };
    localStorage.setItem(cacheKeyFor(url), JSON.stringify(entry));
  } catch {
    // localStorage unavailable/full — caching is best-effort, don't fail the request over it.
  }
}

/**
 * For GET requests: retries transient failures, times out hung requests, caches
 * every successful response body to localStorage, and — if the (retried) request
 * still fails — falls back to the last cached response instead of erroring out.
 * Fallback responses carry an `x-cache-date` header (epoch ms) so callers can
 * tell a served-from-cache response apart from a live one and show staleness.
 */
export const httpCacheInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const url = req.urlWithParams;

  return next(req).pipe(
    timeout(REQUEST_TIMEOUT_MS),
    retry({ count: RETRY_COUNT, delay: RETRY_DELAY_MS }),
    tap((event) => {
      if (event instanceof HttpResponse && event.body != null) {
        writeCache(url, event.body);
      }
    }),
    catchError((error) => {
      const cached = readCache<unknown>(url);
      if (!cached) {
        return throwError(() => error);
      }
      return of(
        new HttpResponse({
          body: cached.data,
          status: 200,
          statusText: 'OK (from cache)',
          url,
          headers: req.headers.set(CACHE_DATE_HEADER, String(cached.timestamp)),
        }),
      );
    }),
  );
};
