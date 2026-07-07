import { TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';

const DARK_CLASS = 'ion-palette-dark';

// jsdom does not implement matchMedia; stub it so ThemeService can be constructed.
function stubMatchMedia(matches = false): void {
  window.matchMedia = ((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as unknown as typeof window.matchMedia;
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove(DARK_CLASS);
    stubMatchMedia();
    TestBed.configureTestingModule({});
  });

  it('defaults to system mode and follows the OS preference', () => {
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('system');
    // jsdom's default matchMedia reports prefers-color-scheme: dark as not matching.
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
  });

  it('applies the dark class in dark mode', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
  });

  it('removes the dark class in light mode and persists the choice', () => {
    const service = TestBed.inject(ThemeService);
    service.setMode('dark');
    service.setMode('light');
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(false);
    expect(localStorage.getItem('theme-mode')).toBe('light');
  });

  it('restores a previously stored mode', () => {
    localStorage.setItem('theme-mode', 'dark');
    const service = TestBed.inject(ThemeService);
    expect(service.mode()).toBe('dark');
    expect(document.documentElement.classList.contains(DARK_CLASS)).toBe(true);
  });
});
