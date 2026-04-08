/**
 * Internationalization (i18n) System for GuildPost
 * Supports multiple languages with RTL foundation
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
 * Simple translation function (keys hardcoded for now)
 */
export function t(key: string, locale: LocaleCode = defaultLocale): string {
  const translations: Record<string, Record<LocaleCode, string>> = {
    'nav.minecraft': {
      en: 'Minecraft', es: 'Minecraft', fr: 'Minecraft', de: 'Minecraft',
      it: 'Minecraft', pt: 'Minecraft', ru: 'Minecraft', zh: 'Minecraft',
      ja: 'Minecraft', ko: 'Minecraft', ar: 'ماينكرافت', he: 'מיינקראפט'
    },
    'nav.wizard': {
      en: 'Wizard', es: 'Asistente', fr: 'Assistant', de: 'Assistent',
      it: 'Assistente', pt: 'Assistente', ru: 'Мастер', zh: '向导',
      ja: 'ウィザード', ko: '마법사', ar: 'مساعد', he: 'אשף'
    },
    'nav.discover': {
      en: 'Discover', es: 'Descubrir', fr: 'Découvrir', de: 'Entdecken',
      it: 'Scopri', pt: 'Descobrir', ru: 'Обзор', zh: '发现',
      ja: '発見', ko: '발견', ar: 'اكتشاف', he: 'גלה'
    },
    'nav.premium': {
      en: 'Premium', es: 'Premium', fr: 'Premium', de: 'Premium',
      it: 'Premium', pt: 'Premium', ru: 'Премиум', zh: '高级版',
      ja: 'プレミアム', ko: '프리미엄', ar: 'مميز', he: 'פרימיום'
    },
    'nav.uptime': {
      en: 'Uptime', es: 'Tiempo Activo', fr: 'Uptime', de: 'Uptime',
      it: 'Uptime', pt: 'Uptime', ru: 'Аптайм', zh: '在线时间',
      ja: '稼働時間', ko: '가동 시간', ar: 'وقت التشغيل', he: 'זמן פעילות'
    },
    'nav.events': {
      en: 'Events', es: 'Eventos', fr: 'Événements', de: 'Events',
      it: 'Eventi', pt: 'Eventos', ru: 'События', zh: '活动',
      ja: 'イベント', ko: '이벤트', ar: 'الأحداث', he: 'אירועים'
    },
    'nav.bannerMaker': {
      en: 'Banner Maker', es: 'Creador de Banners', fr: 'Créateur de Bannières',
      de: 'Banner-Ersteller', it: 'Creatore di Banner', pt: 'Criador de Banners',
      ru: 'Создатель Баннеров', zh: '横幅制作器', ja: 'バナーメーカー',
      ko: '배너 제작자', ar: 'صانع اللافتات', he: 'יוצר באנרים'
    },
    'nav.categories': {
      en: 'Categories', es: 'Categorías', fr: 'Catégories', de: 'Kategorien',
      it: 'Categorie', pt: 'Categorias', ru: 'Категории', zh: '分类',
      ja: 'カテゴリー', ko: '카테고리', ar: 'الفئات', he: 'קטגוריות'
    },
    'nav.favorites': {
      en: 'Favorites', es: 'Favoritos', fr: 'Favoris', de: 'Favoriten',
      it: 'Preferiti', pt: 'Favoritos', ru: 'Избранное', zh: '收藏',
      ja: 'お気に入り', ko: '즐겨찾기', ar: 'المفضلة', he: 'מועדפים'
    },
    'nav.dashboard': {
      en: 'Dashboard', es: 'Panel', fr: 'Tableau de Bord', de: 'Dashboard',
      it: 'Dashboard', pt: 'Painel', ru: 'Панель', zh: '仪表板',
      ja: 'ダッシュボード', ko: '대시보드', ar: 'لوحة التحكم', he: 'לוח מחוונים'
    },
    'nav.addServer': {
      en: 'Add Server', es: 'Añadir Servidor', fr: 'Ajouter un Serveur',
      de: 'Server Hinzufügen', it: 'Aggiungi Server', pt: 'Adicionar Servidor',
      ru: 'Добавить Сервер', zh: '添加服务器', ja: 'サーバーを追加',
      ko: '서버 추가', ar: 'إضافة خادم', he: 'הוסף שרת'
    },
    'nav.compare': {
      en: 'Compare', es: 'Comparar', fr: 'Comparer', de: 'Vergleichen',
      it: 'Confronta', pt: 'Comparar', ru: 'Сравнить', zh: '比较',
      ja: '比較', ko: '비교', ar: 'مقارنة', he: 'השווה'
    },
    'common.more': {
      en: 'More', es: 'Más', fr: 'Plus', de: 'Mehr',
      it: 'Altro', pt: 'Mais', ru: 'Ещё', zh: '更多',
      ja: 'もっと', ko: '더보기', ar: 'المزيد', he: 'עוד'
    }
  };
  
  const translation = translations[key]?.[locale] || translations[key]?.[defaultLocale];
  return translation || key;
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
