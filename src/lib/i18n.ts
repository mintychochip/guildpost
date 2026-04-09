/**
 * Internationalization (i18n) System for GuildPost
 * Supports multiple languages with RTL foundation
 * Crowdin-managed translations
 */

// Available locales configuration
export const locales = {
  en: { name: 'English', flag: '🇺🇸', dir: 'ltr', code: 'en' },
  es: { name: 'Español', flag: '🇪🇸', dir: 'ltr', code: 'es' },
  fr: { name: 'Français', flag: '🇫🇷', dir: 'ltr', code: 'fr' },
  de: { name: 'Deutsch', flag: '🇩🇪', dir: 'ltr', code: 'de' },
  it: { name: 'Italiano', flag: '🇮🇹', dir: 'ltr', code: 'it' },
  pt: { name: 'Português', flag: '🇵🇹', dir: 'ltr', code: 'pt' },
  ru: { name: 'Русский', flag: '🇷🇺', dir: 'ltr', code: 'ru' },
  zh: { name: '中文', flag: '🇨🇳', dir: 'ltr', code: 'zh' },
  ja: { name: '日本語', flag: '🇯🇵', dir: 'ltr', code: 'ja' },
  ko: { name: '한국어', flag: '🇰🇷', dir: 'ltr', code: 'ko' },
  ar: { name: 'العربية', flag: '🇸🇦', dir: 'rtl', code: 'ar' },
  he: { name: 'עברית', flag: '🇮🇱', dir: 'rtl', code: 'he' },
} as const;

export type LocaleCode = keyof typeof locales;
export type LocaleInfo = typeof locales[LocaleCode];

// RTL (Right-to-Left) languages
export const rtlLocales: LocaleCode[] = ['ar', 'he'];

// Default locale
export const defaultLocale: LocaleCode = 'en';

// Local storage key
const STORAGE_KEY = 'guildpost-locale';

// Cache for loaded translations
const translationCache: Record<LocaleCode, Record<string, any>> = {
  en: {},
  es: {},
  fr: {},
  de: {},
  it: {},
  pt: {},
  ru: {},
  zh: {},
  ja: {},
  ko: {},
  ar: {},
  he: {}
};

/**
 * Load translations for a locale
 */
export async function loadTranslations(locale: LocaleCode): Promise<void> {
  if (translationCache[locale] && Object.keys(translationCache[locale]).length > 0) {
    return; // Already loaded
  }
  
  try {
    const namespaces = ['common', 'server', 'submit'];
    const translations: Record<string, any> = {};
    
    for (const ns of namespaces) {
      try {
        const response = await fetch(`/locales/${locale}/${ns}.json`);
        if (response.ok) {
          translations[ns] = await response.json();
        }
      } catch (e) {
        // Fall back to English if translation file doesn't exist
        if (locale !== 'en') {
          const fallbackResponse = await fetch(`/locales/en/${ns}.json`);
          if (fallbackResponse.ok) {
            translations[ns] = await fallbackResponse.json();
          }
        }
      }
    }
    
    translationCache[locale] = translations;
  } catch (e) {
    console.error('Failed to load translations:', e);
  }
}

/**
 * Get the text direction for a locale
 */
export function getTextDirection(locale: LocaleCode): 'ltr' | 'rtl' {
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
}

/**
 * Detect browser locale from navigator.languages or navigator.language
 */
export function detectBrowserLocale(): LocaleCode {
  if (typeof navigator === 'undefined') return defaultLocale;
  
  const browserLangs = navigator.languages || [navigator.language];
  
  for (const lang of browserLangs) {
    if (typeof lang !== 'string') continue;
    const exactCode = lang.split('-')[0] as LocaleCode;
    if (exactCode in locales) {
      return exactCode;
    }
  }
  
  return defaultLocale;
}

/**
 * Get stored locale from localStorage or detect from browser
 */
export function getStoredLocale(): LocaleCode {
  if (typeof localStorage === 'undefined') return detectBrowserLocale();
  
  const stored = localStorage.getItem(STORAGE_KEY) as LocaleCode | null;
  if (stored && stored in locales) {
    return stored;
  }
  
  return detectBrowserLocale();
}

/**
 * Save locale to localStorage
 */
export function saveLocale(locale: LocaleCode): void {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, locale);
  }
}

/**
 * Translation function with namespace support
 * Usage: t('nav.minecraft') or t('server.status.online')
 */
export function t(key: string, locale: LocaleCode = defaultLocale): string {
  const [namespace, ...path] = key.split('.');
  const translations = translationCache[locale];
  
  if (!translations || !translations[namespace]) {
    // Fall back to English
    const enTranslations = translationCache['en'];
    if (enTranslations && enTranslations[namespace]) {
      let value = enTranslations[namespace];
      for (const segment of path) {
        value = value?.[segment];
      }
      return value || key;
    }
    return key;
  }
  
  let value = translations[namespace];
  for (const segment of path) {
    value = value?.[segment];
  }
  
  return value || key;
}

/**
 * Initialize i18n on the client side
 */
export async function initI18n(locale?: LocaleCode): Promise<void> {
  const targetLocale = locale || getStoredLocale();
  await loadTranslations(targetLocale);
  await loadTranslations('en'); // Always load English as fallback
}

/**
 * Client-side initialization script as a string
 */
export function getClientInitScript(): string {
  return `
    (function() {
      const STORAGE_KEY = 'guildpost-locale';
      const RTL_LOCALES = ['ar', 'he'];
      const DEFAULT_LOCALE = 'en';
      
      function detectBrowserLocale() {
        const browserLangs = navigator.languages || [navigator.language];
        for (const lang of browserLangs) {
          const exactCode = lang.split('-')[0];
          if (['en', 'es', 'fr', 'de', 'it', 'pt', 'ru', 'zh', 'ja', 'ko', 'ar', 'he'].includes(exactCode)) {
            return exactCode;
          }
        }
        return DEFAULT_LOCALE;
      }
      
      function getStoredLocale() {
        try {
          const stored = localStorage.getItem(STORAGE_KEY);
          if (stored) return stored;
        } catch (e) {}
        return detectBrowserLocale();
      }
      
      function applyLocale(locale) {
        const dir = RTL_LOCALES.includes(locale) ? 'rtl' : 'ltr';
        document.documentElement.lang = locale;
        document.documentElement.dir = dir;
        if (dir === 'rtl') {
          document.documentElement.classList.add('rtl');
          document.documentElement.classList.remove('ltr');
        } else {
          document.documentElement.classList.add('ltr');
          document.documentElement.classList.remove('rtl');
        }
      }
      
      applyLocale(getStoredLocale());
    })();
  `;
}

export default {
  t,
  locales,
  defaultLocale,
  rtlLocales,
  getTextDirection,
  detectBrowserLocale,
  getStoredLocale,
  getClientInitScript,
};
