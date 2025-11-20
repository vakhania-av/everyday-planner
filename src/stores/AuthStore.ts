import { observable, action, makeObservable, computed } from 'mobx'
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuth as apiCheckAuth, updateUser } from '../api/auth';
import { IUser } from '@/types/user';

class AuthStore {
  @observable currentUser: IUser | null = null;
  @observable loading: boolean = true;
  @observable isLoggingOut: boolean = false;

  constructor() {
    makeObservable(this);
    this.initializeAuth();
  }

  @action
  setUser = (user: IUser | null) => {
    this.currentUser = user;
  };

  @action
  setLoading = (loading: boolean) => {
    this.loading = loading;
  };

  @action
  setLoggingOut = (loggingOut: boolean) => {
    this.isLoggingOut = loggingOut;
  };

  @action
  login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await apiLogin(email, password);

      this.setUser(response?.user || null);
    } catch (err) {
      throw err;
    }
  };

  @action
  register = async (name: string, email: string, password: string): Promise<void> => {
    try {
      const response = await apiRegister(name, email, password);

      this.setUser(response?.user || null);
    } catch (err) {
      throw err;
    }
  };

  @action
  logout = async (): Promise<void> => {
    try {
      this.setLoggingOut(true);
      await apiLogout();
      this.setUser(null);
    } catch (err) {
      throw err;
    } finally {
      this.setLoggingOut(false);
    }
  };

  @action
  initializeAuth = async (): Promise<void> => {
    try {
      const { authenticated, user } = await apiCheckAuth();
      
      this.setUser(authenticated && user ? user : null);
    } catch (err) {
      console.error(err);
      this.setUser(null);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  updateProfile = async (data: { name: string, email: string }): Promise<void> => {
    try {
      const { user:updatedUser } = await updateUser(data);

      this.setUser(updatedUser);
    } catch (err) {
      throw err;
    }
  };

  @computed
  get loggingOut(): boolean {
    return this.isLoggingOut;
  };

  @computed
  get isAuthenticated(): boolean {
    return this.currentUser !== null;
  }
}

export default AuthStore;