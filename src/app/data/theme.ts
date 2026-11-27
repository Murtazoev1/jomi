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
  blue: {
    id: 'blue', name: 'Классический', season: 'Лето', emoji: '☀️',
    sidebarFrom: '#0A0A2E', sidebarTo: '#0F2FA8',
    primary: '#1E4FD8', primaryLight: '#6B84E8',
    c1: '#4F6FFF', c2: '#004BAD', c3: '#1A00A8', c4: '#38B6FF',
    pageBg: '#f0f4ff', cardBorder: '#e0e7ff',
    navActive: 'rgba(255,255,255,0.18)',
    splashFrom: '#0f0c29', splashTo: '#1E4FD8',
  },
  orange: {
    id: 'orange', name: 'Осенняя', season: 'Осень', emoji: '🍂',
    sidebarFrom: '#1a0a00', sidebarTo: '#8B3A00',
    primary: '#D4580A', primaryLight: '#F4883A',
    c1: '#FF8C42', c2: '#CC4A00', c3: '#7A2800', c4: '#FFB347',
    pageBg: '#fff8f0', cardBorder: '#ffe0c0',
    navActive: 'rgba(255,200,100,0.22)',
    splashFrom: '#1a0800', splashTo: '#D4580A',
  },
  cyan: {
    id: 'cyan', name: 'Зимняя', season: 'Зима', emoji: '❄️',
    sidebarFrom: '#001a2e', sidebarTo: '#005f8f',
    primary: '#0096C7', primaryLight: '#48CAE4',
    c1: '#00B4D8', c2: '#0077B6', c3: '#03045E', c4: '#90E0EF',
    pageBg: '#f0faff', cardBorder: '#c0eaff',
    navActive: 'rgba(144,224,239,0.22)',
    splashFrom: '#001a2e', splashTo: '#0096C7',
  },
  pink: {
    id: 'pink', name: 'Весенняя', season: 'Весна', emoji: '🌸',
    sidebarFrom: '#1a0020', sidebarTo: '#6a0050',
    primary: '#C2185B', primaryLight: '#F06292',
    c1: '#EC407A', c2: '#AD1457', c3: '#6A1040', c4: '#66BB6A',
    pageBg: '#fff0f8', cardBorder: '#ffd0e8',
    navActive: 'rgba(236,64,122,0.2)',
    splashFrom: '#1a0020', splashTo: '#C2185B',
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
