import { action, computed, makeObservable, observable } from "mobx";

class ThemeStore {
  @observable currentTheme = 'light';
  @observable systemPreference = false;

  mediaQuery = null;
  systemThemeListener = null;

  constructor() {
    makeObservable(this);

    // Загружаем сохранённую тему из LocalStorage
    this.loadThemeFromStorage();
    // Слушаем изменения системной темы
    this.watchSystemTheme();
  }

  @action
  setTheme = (theme) => {
    this.currentTheme = theme;
    this.systemPreference = false;
    this.saveThemeToStorage();
    this.applyThemeToDOM();
  };

  @action
  setSystemPreference = (useSystem) => {
    this.systemPreference = useSystem;

    if (useSystem) {
      this.applySystemTheme();
    }

    this.saveThemeToStorage();
  };

  @action
  toggleTheme = () => {
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
  loadThemeFromStorage = () => {
    const savedTheme = localStorage.getItem('app-theme');
    const savedSystemPref = localStorage.getItem('app-theme-system');

    if (savedSystemPref) {
      this.systemPreference = true;

      this.applySystemTheme();
    } else if (savedTheme) {
      this.currentTheme = savedTheme;

      this.applyThemeToDOM();
    } else {
      // Первый запуск - используем системную тему
      this.systemPreference = true;

      this.applySystemTheme();
    }
  };

  @action
  saveThemeToStorage = () => {
    localStorage.setItem('app-theme', this.currentTheme);
    localStorage.setItem('app-theme-system', String(this.systemPreference));
  };

  @action
  applySystemTheme = () => {
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    this.currentTheme = systemDark ? 'dark' : 'light';
    this.applyThemeToDOM();
  };

  @action
  applyThemeToDOM = () => {
    document.documentElement.setAttribute('data-theme', this.currentTheme);
  };

  watchSystemTheme = () => {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    this.systemThemeListener = () => {
      if (this.systemPreference) {
        this.applySystemTheme();
      }
    };

    this.mediaQuery.addEventListener('change', this.systemThemeListener);
  };

  dispose = () => {
    if (this.mediaQuery && this.systemThemeListener) {
      this.mediaQuery.removeEventListener('change', this.systemThemeListener);
    }
  };
}

export default ThemeStore;
