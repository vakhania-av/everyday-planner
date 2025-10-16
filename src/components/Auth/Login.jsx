import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useToast } from '../../context/ToastContext';
import { useNavigate, Link as LinkRouter } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      setError('');
      setLoading(true);

      // Логиним пользователя
      await login(email, password);

      // Показываем уведомление об успешной авторизации
      addToast('Successfully logged in! Welcome back!', 'info', 3000);

      // Перенаправляем на dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to log in: ${err.message}`;

      setError(errorMessage);
      // Показываем уведомление об ошибке
      addToast(errorMessage, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const errorCondition = error && (
    <Typography color="error" align="center" sx={{ mb: 2 }}>
      {error}
    </Typography>
  );

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>
        {errorCondition}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            required
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <LinkRouter to="/forgot-password" style={{ textDecoration: 'none' }}>
              <Button color="primary" size="small">Forgot your password?</Button>
            </LinkRouter>
          </Box>
          <Typography align="center">
            Don't have an account?{' '}
            <Link href="/register" underline="hover">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
