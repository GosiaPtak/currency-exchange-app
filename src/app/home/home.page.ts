import { KeyValuePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject, of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { addIcons } from 'ionicons';
import { swapVerticalOutline, informationCircleOutline } from 'ionicons/icons';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonIcon,
  IonSpinner,
} from '@ionic/angular/standalone';
import { FrankfurterService } from '../core/frankfurter.service';
import { evaluateExpression } from '../core/expression';
import { TranslationService } from '../core/translation.service';

const ALLOWED_INPUT_CHARS = /[^0-9+\-*/(). ]/g;

interface ConversionRequest {
  amount: number;
  from: string;
  to: string;
}

interface RateRequest {
  from: string;
  to: string;
}

@Component({
  selector: 'app-home',
  imports: [
    KeyValuePipe,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonButton,
    IonIcon,
    IonSpinner,
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.css',
})
export class HomePage implements OnInit {
  private readonly frankfurter = inject(FrankfurterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly conversionRequest$ = new Subject<ConversionRequest>();
  private readonly rateRequest$ = new Subject<RateRequest>();

  protected readonly i18n = inject(TranslationService);

  protected readonly currencies = signal<Record<string, string>>({});
  protected readonly amountExpression = signal('1');
  protected readonly from = signal('USD');
  protected readonly to = signal('EUR');
  protected readonly result = signal<number | null>(null);
  protected readonly rate = signal<number | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly rateText = computed(() => {
    const rate = this.rate();
    return rate === null ? '—' : `1 ${this.from()} = ${rate.toFixed(4)} ${this.to()}`;
  });

  constructor() {
    addIcons({ swapVerticalOutline, informationCircleOutline });
  }

  ngOnInit(): void {
    this.frankfurter.getCurrencies().subscribe({
      next: (currencies) => this.currencies.set(currencies),
      error: () => this.error.set(this.i18n.t('home.loadCurrenciesError')),
    });

    this.conversionRequest$
      .pipe(
        distinctUntilChanged(
          (a, b) => a.amount === b.amount && a.from === b.from && a.to === b.to,
        ),
        debounceTime(300),
        switchMap(({ amount, from, to }) => {
          if (from === to) {
            return of(amount);
          }
          this.loading.set(true);
          this.error.set(null);
          return this.frankfurter.convert(amount, from, to).pipe(
            catchError(() => {
              this.error.set(this.i18n.t('home.conversionError'));
              this.loading.set(false);
              return of(null);
            }),
          );
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => {
        this.loading.set(false);
        value !== null && this.result.set(value);
      });

    this.rateRequest$
      .pipe(
        distinctUntilChanged((a, b) => a.from === b.from && a.to === b.to),
        switchMap(({ from, to }) => {
          if (from === to) {
            return of(1);
          }
          return this.frankfurter.convert(1, from, to).pipe(catchError(() => of(null)));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((value) => this.rate.set(value));

    this.requestConversion();
    this.requestRate();
  }

  onExpressionChange(value: string | number | null | undefined): void {
    const sanitized = String(value ?? '').replace(ALLOWED_INPUT_CHARS, '');
    this.amountExpression.set(sanitized);
    this.requestConversion();
  }

  onFromChange(value: string): void {
    this.from.set(value);
    this.requestConversion();
    this.requestRate();
  }

  onToChange(value: string): void {
    this.to.set(value);
    this.requestConversion();
    this.requestRate();
  }

  swap(): void {
    const from = this.from();
    const to = this.to();
    this.from.set(to);
    this.to.set(from);
    this.requestConversion();
    this.requestRate();
  }

  private requestConversion(): void {
    let amount: number;
    try {
      amount = evaluateExpression(this.amountExpression());
    } catch {
      // Incomplete/invalid expression while the user is still typing — skip.
      return;
    }
    this.conversionRequest$.next({ amount, from: this.from(), to: this.to() });
  }

  private requestRate(): void {
    this.rateRequest$.next({ from: this.from(), to: this.to() });
  }
}
