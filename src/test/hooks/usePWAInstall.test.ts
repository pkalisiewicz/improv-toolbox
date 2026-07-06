import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { usePWAInstall } from '../../hooks/usePWAInstall';

describe('usePWAInstall', () => {
  beforeEach(() => {
    // Reset matchMedia to non-standalone
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        media: '',
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
      }),
    });
    // Non-iOS userAgent
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      configurable: true,
    });
  });

  describe('initial state', () => {
    it('starts with no installPrompt', () => {
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.installPrompt).toBeNull();
    });

    it('isInstalled is false in non-standalone mode', () => {
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isInstalled).toBe(false);
    });

    it('isIOS is false for non-iOS userAgent', () => {
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isIOS).toBe(false);
    });
  });

  describe('iOS detection', () => {
    it('detects iPhone user agent as iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isIOS).toBe(true);
    });

    it('detects iPad user agent as iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPad; CPU OS 14_0 like Mac OS X)',
        configurable: true,
      });
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isIOS).toBe(true);
    });

    it('detects iPod user agent as iOS', () => {
      Object.defineProperty(navigator, 'userAgent', {
        value: 'Mozilla/5.0 (iPod touch; CPU iPhone OS 14_0 like Mac OS X)',
        configurable: true,
      });
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isIOS).toBe(true);
    });
  });

  describe('standalone detection', () => {
    it('isInstalled is true when matchMedia returns standalone', () => {
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({ matches: true }),
      });
      const { result } = renderHook(() => usePWAInstall());
      expect(result.current.isInstalled).toBe(true);
    });
  });

  describe('install', () => {
    it('is a no-op when installPrompt is null', async () => {
      const { result } = renderHook(() => usePWAInstall());
      // Should not throw
      await expect(result.current.install()).resolves.toBeUndefined();
    });
  });

  describe('beforeinstallprompt event', () => {
    it('captures the event and stores it as installPrompt', () => {
      const { result } = renderHook(() => usePWAInstall());
      const mockPromptEvent = {
        preventDefault: vi.fn(),
        prompt: vi.fn().mockResolvedValue(undefined),
        userChoice: Promise.resolve({ outcome: 'accepted' as const }),
      };
      act(() => {
        window.dispatchEvent(
          Object.assign(new Event('beforeinstallprompt'), mockPromptEvent),
        );
      });
      expect(result.current.installPrompt).not.toBeNull();
    });
  });

  describe('appinstalled event', () => {
    it('marks as installed and clears prompt', () => {
      const { result } = renderHook(() => usePWAInstall());
      act(() => {
        window.dispatchEvent(new Event('appinstalled'));
      });
      expect(result.current.isInstalled).toBe(true);
      expect(result.current.installPrompt).toBeNull();
    });
  });
});
