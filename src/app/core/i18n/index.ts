import { en } from './en';
import { pl } from './pl';
import { ko } from './ko';

export type Lang = 'en' | 'pl' | 'ko';
export type TranslationKey = keyof typeof en;

export const SUPPORTED_LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
  { code: 'ko', label: '한국어' },
];

export const TRANSLATIONS: Record<Lang, Record<TranslationKey, string>> = {
  en,
  pl,
  ko,
};
