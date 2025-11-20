import { ThemeType } from "@/types/theme";
import { action, makeObservable, observable } from "mobx";

class ThemeStore {
  @observable currentTheme: ThemeType = 'light';
  @observable systemPreference: boolean = false;

  private mediaQuery: MediaQueryList | null = null;
  private systemThemeListener: ((evt: MediaQueryListEvent) => void) | null = null;

  constructor() {
    makeObservable(this);
    // Загружаем сохранённую тему из LocalStorage
    this.loadThemeFromStorage();
    // Слушаем изменения системной темы
    this.watchSystemTheme();
  }

  @action
  setTheme = (theme: ThemeType): void => {
    this.currentTheme = theme;
    this.systemPreference = false;
    this.saveThemeToStorage();
    this.applyThemeToDOM();
  };

  @action
  setSystemPreference = (useSystem: boolean): void => {
    this.systemPreference = useSystem;

    if (useSystem) {
      this.applySystemTheme();
    }

    this.saveThemeToStorage();
  };

  @action
  toggleTheme = (): void => {
    if (this.systemPreference) {
      this.systemPreference = false;
      this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';

      this.saveThemeToStorage();
      this.applyThemeToDOM();
    } else {
      this.setTheme(this.currentTheme === 'light' ? 'dark' : 'light');
    }
  };

  @action
  loadThemeFromStorage = (): void => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeType | null;
    const savedSystemPref = localStorage.getItem('app-theme-system');

    if (savedSystemPref !== null) {
      this.systemPreference = true;
      this.applySystemTheme();
    } else if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.currentTheme = savedTheme;
      this.applyThemeToDOM();
    } else {
      // Первый запуск - используем системную тему
      this.systemPreference = true;
      this.applySystemTheme();
    }
  };

  @action
  saveThemeToStorage = (): void => {
    localStorage.setItem('app-theme', this.currentTheme);
    localStorage.setItem('app-theme-system', String(this.systemPreference));
  };

  @action
  applySystemTheme = (): void => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.currentTheme = systemDark ? 'dark' : 'light';
    this.applyThemeToDOM();
  };

  @action
  applyThemeToDOM = (): void => {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  };

  watchSystemTheme = (): void => {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.systemThemeListener = () => {
      if (this.systemPreference) {
        this.applySystemTheme();
      }
    };

    this.mediaQuery.addEventListener('change', this.systemThemeListener);
  };

  dispose = (): void => {
    if (this.mediaQuery && this.systemThemeListener) {
      this.mediaQuery.removeEventListener('change', this.systemThemeListener);
    }

    this.mediaQuery = null;
    this.systemThemeListener = null;
  };
}

export default ThemeStore;
