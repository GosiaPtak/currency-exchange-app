import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const BASE_URL = 'https://api.frankfurter.dev/v1';

export interface LatestRates {
  amount: number;
  base: string;
  date: string;
  rates: Record<string, number>;
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

  convert(amount: number, from: string, to: string): Observable<number> {
    return this.http
      .get<LatestRates>(`${BASE_URL}/latest`, {
        params: { amount, base: from, symbols: to },
      })
      .pipe(map((res) => res.rates[to]));
  }
}
