import { createContext, useContext, useEffect, useState } from "react";
import { login as apiLogin, register as apiRegister, logout as apiLogout, checkAuth as apiCheckAuth, updateUser } from '../api/auth.js'

const AuthContext = createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const data = await apiCheckAuth();

        if (data?.authenticated) {
          setCurrentUser(data.user);
        }
      } catch (err) {
        console.error(err);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);

    setCurrentUser(response.user);
  };

  const register = async (name, email, password) => {
    const response = await apiRegister(name, email, password);

    setCurrentUser(response.user);
  };

  const logout = async () => {
    await apiLogout();
    setCurrentUser(null);
  };

  const updateProfile = async ({ name, email }) => {
    const updatedUser = await updateUser({ name, email });

    setCurrentUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ currentUser, updateProfile, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context;
};
