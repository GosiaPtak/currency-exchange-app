import { HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, defer, firstValueFrom, of, throwError } from 'rxjs';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CACHE_DATE_HEADER, httpCacheInterceptor } from './http-cache.interceptor';

const URL = 'https://api.frankfurter.dev/v1/latest?base=USD&symbols=EUR';

describe('httpCacheInterceptor', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('passes non-GET requests straight through, untouched', async () => {
    const req = new HttpRequest('POST', URL, { amount: 1 });
    const response = new HttpResponse({ body: { ok: true }, status: 200 });
    const next = vi.fn(() => of(response));

    const result = await firstValueFrom(httpCacheInterceptor(req, next));

    expect(result).toBe(response);
    expect(localStorage.length).toBe(0);
  });

  it('caches a successful GET response body', async () => {
    const req = new HttpRequest('GET', URL);
    const body = { rates: { EUR: 0.87 } };
    const next = vi.fn(() => of(new HttpResponse({ body, status: 200 })));

    await firstValueFrom(httpCacheInterceptor(req, next));

    const raw = localStorage.getItem(`http-cache:${req.urlWithParams}`);
    expect(raw).not.toBeNull();
    expect(JSON.parse(raw!).data).toEqual(body);
  });

  it('retries a failing GET (initial attempt + 2 retries) before giving up', async () => {
    vi.useFakeTimers();
    const req = new HttpRequest('GET', URL);
    let attempts = 0;
    const next = vi.fn(() =>
      defer(() => {
        attempts++;
        return throwError(() => new Error('network down'));
      }),
    );

    const pending = firstValueFrom(httpCacheInterceptor(req, next)).catch((e: Error) => e);
    await vi.runAllTimersAsync();
    const result = await pending;

    expect(attempts).toBe(3);
    expect(result).toBeInstanceOf(Error);
  });

  it('falls back to the cached entry when every retry still fails', async () => {
    vi.useFakeTimers();
    const req = new HttpRequest('GET', URL);
    const cachedBody = { rates: { EUR: 0.85 } };
    localStorage.setItem(
      `http-cache:${req.urlWithParams}`,
      JSON.stringify({ data: cachedBody, timestamp: 12345 }),
    );
    const next = vi.fn(() => defer(() => throwError(() => new Error('network down'))));

    const pending = firstValueFrom(httpCacheInterceptor(req, next));
    await vi.runAllTimersAsync();
    const result = (await pending) as HttpResponse<unknown>;

    expect(result.body).toEqual(cachedBody);
    expect(result.headers.get(CACHE_DATE_HEADER)).toBe('12345');
  });

  it('propagates the error when there is nothing cached to fall back to', async () => {
    vi.useFakeTimers();
    const req = new HttpRequest('GET', URL);
    const next = vi.fn(() => defer(() => throwError(() => new Error('network down'))));

    const pending = firstValueFrom(httpCacheInterceptor(req, next)).catch((e: Error) => e);
    await vi.runAllTimersAsync();
    const result = await pending;

    expect(result).toBeInstanceOf(Error);
  });

  it('treats a hung request as a failure and falls back to cache', async () => {
    vi.useFakeTimers();
    const req = new HttpRequest('GET', URL);
    const cachedBody = { rates: { EUR: 0.85 } };
    localStorage.setItem(
      `http-cache:${req.urlWithParams}`,
      JSON.stringify({ data: cachedBody, timestamp: 12345 }),
    );
    // Never emits — simulates a connection that hangs instead of erroring.
    const next = vi.fn(() => new Observable<never>());

    const pending = firstValueFrom(httpCacheInterceptor(req, next));
    await vi.runAllTimersAsync();
    const result = (await pending) as HttpResponse<unknown>;

    expect(result.body).toEqual(cachedBody);
  });
});
