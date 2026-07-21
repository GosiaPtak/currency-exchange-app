import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CACHE_DATE_HEADER } from './http-cache.interceptor';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export interface LatestRates {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
}

export interface ConversionResult {
  value: number;
  /** True when this value was served from the local cache instead of a live response. */
  stale: boolean;
  /** Epoch ms the cached value was originally fetched; null unless `stale` is true. */
  asOf: number | null;
}

@Injectable({ providedIn: 'root' })
export class FrankfurterService {
  private readonly http = inject(HttpClient);

  getCurrencies(): Observable<Record<string, string>> {
    return this.http.get<Record<string, string>>(`${BASE_URL}/currencies`);
  }

  getLatestRates(base: string, symbols?: string[]): Observable<LatestRates> {
    let params: Record<string, string> = { base };
    if (symbols?.length) {
      params = { ...params, symbols: symbols.join(',') };
    }
    return this.http.get<LatestRates>(`${BASE_URL}/latest`, { params });
  }

  convert(amount: number, from: string, to: string): Observable<ConversionResult> {
    return this.http
      .get<LatestRates>(`${BASE_URL}/latest`, {
        params: { amount, base: from, symbols: to },
        observe: 'response',
      })
      .pipe(
        map((res: HttpResponse<LatestRates>) => {
          const cacheDate = res.headers.get(CACHE_DATE_HEADER);
          return {
            value: res.body!.rates[to],
            stale: cacheDate !== null,
            asOf: cacheDate !== null ? Number(cacheDate) : null,
          };
        }),
      );
  }
}
