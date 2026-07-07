import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({});
  });

  it('defaults to English when nothing is stored', () => {
    const service = TestBed.inject(TranslationService);
    expect(service.lang()).toBe('en');
    expect(service.t('tabs.convert')).toBe('Convert');
  });

  it('restores a previously stored language', () => {
    localStorage.setItem('lang', 'pl');
    const service = TestBed.inject(TranslationService);
    expect(service.lang()).toBe('pl');
    expect(service.t('tabs.convert')).toBe('Przelicz');
  });

  it('switches language and persists the choice', () => {
    const service = TestBed.inject(TranslationService);
    service.setLang('pl');
    expect(service.lang()).toBe('pl');
    expect(service.t('settings.title')).toBe('Ustawienia');
    expect(localStorage.getItem('lang')).toBe('pl');
  });

  it('supports Korean', () => {
    const service = TestBed.inject(TranslationService);
    service.setLang('ko');
    expect(service.t('tabs.settings')).toBe('설정');
  });

  it('lists all supported languages', () => {
    const service = TestBed.inject(TranslationService);
    expect(service.supportedLanguages.map((entry) => entry.code)).toEqual(['en', 'pl', 'ko']);
  });
});
