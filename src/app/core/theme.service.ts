import { Injectable, effect, signal } from '@angular/core';

export type ThemeMode = 'light' | 'dark' | 'system';

const STORAGE_KEY = 'theme-mode';
const DARK_CLASS = 'ion-palette-dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly media = window.matchMedia('(prefers-color-scheme: dark)');
  private readonly systemPrefersDark = signal(this.media.matches);

  readonly mode = signal<ThemeMode>(this.readStoredMode());

  constructor() {
    // Apply synchronously once so there's no flash of the wrong theme
    // before the reactive effect below gets its first (async) run.
    this.applyTheme();

    this.media.addEventListener('change', (event) => {
      this.systemPrefersDark.set(event.matches);
    });

    effect(() => this.applyTheme());
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    localStorage.setItem(STORAGE_KEY, mode);
    // Apply immediately rather than waiting for the effect's async flush.
    this.applyTheme();
  }

  private applyTheme(): void {
    const dark = this.mode() === 'dark' || (this.mode() === 'system' && this.systemPrefersDark());
    document.documentElement.classList.toggle(DARK_CLASS, dark);
  }

  private readStoredMode(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
