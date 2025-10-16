import { Box, createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import AuthProvider, { useAuth } from "./context/AuthContext";
import ToastProvider from "./context/ToastContext";

import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PublicRoute from "./components/Layout/PublicRoute";
import PrivateRoute from "./components/Layout/PrivateRoute";
import Profile from "./pages/Profile";
import LoadingSpinner from "./components/Layout/LoadingSpinner";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import Footer from "./components/Layout/Footer";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import 'dayjs/locale/ru.js';

import { ruRU } from "@mui/x-date-pickers/locales";

const theme = createTheme();

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingSpinner message="Проверка авторизации..." />;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Routes>
        {/* Публичные маршруты - доступны только НЕавторизованным */}
        <Route path="/login" element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        } />
        <Route path="/register" element={
          <PublicRoute>
            <Register />
          </PublicRoute>
        } />
        <Route path="/forgot-password" element={
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        } />
        <Route path="/reset-password" element={
          <PublicRoute>
            <ResetPassword />
          </PublicRoute>
        } />

        {/* Приватные маршруты - доступны только авторизованным */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>}
        />

        {/* Главная страница - доступна всем */}
        <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </Box>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ru"
        localeText={ruRU.components.MuiLocalizationProvider.defaultProps.localeText}
      >
        <ToastProvider>
          <Router>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </Router>
        </ToastProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
