export type ThemeId = 'blue' | 'orange' | 'cyan' | 'pink';

export interface Theme {
  id: ThemeId;
  name: string;
  season: string;
  emoji: string;
  // Sidebar gradient
  sidebarFrom: string;
  sidebarTo: string;
  // Primary button/accent
  primary: string;
  primaryLight: string;
  // Circle colors for logo (top, left, bottom, right)
  c1: string; c2: string; c3: string; c4: string;
  // Background
  pageBg: string;
  // Card border
  cardBorder: string;
  // Active nav bg
  navActive: string;
  // Splash bg
  splashFrom: string;
  splashTo: string;
}

export const THEMES: Record<ThemeId, Theme> = {
  // Классическая синяя — из оригинального логотипа JOMI
  blue: {
    id: 'blue', name: 'Классический', season: 'Лето', emoji: '☀️',
    sidebarFrom: '#0A0A2E', sidebarTo: '#0F2FA8',
    primary: '#2050FF', primaryLight: '#60A5FA',
    c1: '#6B84FF', c2: '#004BAD', c3: '#1A00A8', c4: '#38B6FF',
    pageBg: '#f0f4ff', cardBorder: '#e0e7ff',
    navActive: 'rgba(255,255,255,0.18)',
    splashFrom: '#0f0c29', splashTo: '#1E4FD8',
  },
  // Осенняя — точные цвета из JOMI___Оранжевый.html
  orange: {
    id: 'orange', name: 'Осенняя', season: 'Осень', emoji: '🍂',
    sidebarFrom: '#2a0a00', sidebarTo: '#7a2000',
    primary: '#FF5A5A', primaryLight: '#FFA51F',
    c1: '#FFA51F', c2: '#FF5A5A', c3: '#FF3131', c4: '#FF8F4C',
    pageBg: '#fff8f0', cardBorder: '#ffe0c0',
    navActive: 'rgba(255,165,31,0.25)',
    splashFrom: '#2a0800', splashTo: '#FF3131',
  },
  // Зимняя — точные цвета из JOMI___Синий.html (голубые)
  cyan: {
    id: 'cyan', name: 'Зимняя', season: 'Зима', emoji: '❄️',
    sidebarFrom: '#001a2e', sidebarTo: '#003a6e',
    primary: '#2080FF', primaryLight: '#38BDF8',
    c1: '#38BDF8', c2: '#2080FF', c3: '#2050FF', c4: '#60A5FA',
    pageBg: '#f0faff', cardBorder: '#bae6fd',
    navActive: 'rgba(56,189,248,0.22)',
    splashFrom: '#001830', splashTo: '#2080FF',
  },
  // Весенняя — точные цвета из JOMI___Розово-зелёный.html
  pink: {
    id: 'pink', name: 'Весенняя', season: 'Весна', emoji: '🌸',
    sidebarFrom: '#1a1a00', sidebarTo: '#2d5a00',
    primary: '#4CA726', primaryLight: '#FFC4EA',
    c1: '#FFC4EA', c2: '#FFADAD', c3: '#4CA726', c4: '#98E27A',
    pageBg: '#f0fff4', cardBorder: '#d1fae5',
    navActive: 'rgba(76,167,38,0.25)',
    splashFrom: '#1a2a00', splashTo: '#4CA726',
  },
};

const KEY = 'jomi_theme';
export const getTheme = (): Theme => {
  const id = (localStorage.getItem(KEY) as ThemeId) || 'blue';
  return THEMES[id] || THEMES.blue;
};
export const setTheme = (id: ThemeId) => {
  localStorage.setItem(KEY, id);
  window.dispatchEvent(new Event('jomi-theme-change'));
};
