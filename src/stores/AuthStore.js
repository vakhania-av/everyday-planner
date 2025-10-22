import { observable, action, makeObservable, computed } from 'mobx'
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuth as apiCheckAuth, updateUser } from '../api/auth';

class AuthStore {
  @observable currentUser = null;
  @observable loading = true;
  @observable isLoggingOut = false;

  constructor() {
    makeObservable(this);
    this.initializeAuth();
  }

  @action
  setUser = (user) => {
    this.currentUser = user;
  };

  @action
  setLoading = (loading) => {
    this.loading = loading;
  };

  @action
  setLoggingOut = (loggingOut) => {
    this.isLoggingOut = loggingOut;
  };

  @action
  login = async (email, password) => {
    try {
      const response = await apiLogin(email, password);

      this.setUser(response?.user);
    } catch (err) {
      throw err;
    }
  };

  @action
  register = async (name, email, password) => {
    try {
      const response = await apiRegister(name, email, password);

      this.setUser(response?.user);
    } catch (err) {
      throw err;
    }
  };

  @action
  logout = async () => {
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
  initializeAuth = async () => {
    try {
      const data = await apiCheckAuth();

      data?.authenticated ? this.setUser(data?.user) : this.setUser(null);
    } catch (err) {
      console.error(err);
      this.setUser(null);
    } finally {
      this.setLoading(false);
    }
  };

  @action
  updateProfile = async ({ name, email }) => {
    try {
      const updatedUser = await updateUser({ name, email });

      this.setUser(updatedUser);
    } catch (err) {
      throw err;
    }
  };

  @computed
  get loggingOut() {
    return this.isLoggingOut;
  };
}

export default AuthStore;