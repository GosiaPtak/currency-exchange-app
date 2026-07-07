import { Injectable, computed, signal } from '@angular/core';
import { Lang, SUPPORTED_LANGUAGES, TRANSLATIONS, TranslationKey } from './i18n';

const STORAGE_KEY = 'lang';

@Injectable({ providedIn: 'root' })
export class TranslationService {
  readonly supportedLanguages = SUPPORTED_LANGUAGES;

  readonly lang = signal<Lang>(this.readStoredLang());

  private readonly dictionary = computed(() => TRANSLATIONS[this.lang()]);

  setLang(lang: Lang): void {
    this.lang.set(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }

  t(key: TranslationKey): string {
    return this.dictionary()[key];
  }

  private readStoredLang(): Lang {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && SUPPORTED_LANGUAGES.some((entry) => entry.code === stored)) {
      return stored as Lang;
    }
    const browserLang = navigator.language.slice(0, 2);
    return SUPPORTED_LANGUAGES.some((entry) => entry.code === browserLang)
      ? (browserLang as Lang)
      : 'en';
  }
}
