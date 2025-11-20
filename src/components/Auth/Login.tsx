import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate, Link as LinkRouter } from "react-router-dom";
import { shakeAnimation } from "../../const";
import { observer } from "mobx-react-lite";
import { useAuthStore, useUiStore } from "../../hooks/useStores";

const Login = observer(() => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const { login } = useAuthStore();
  const { addToast } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      setLoading(true);
      // Логиним пользователя
      await login(email, password);
      // Показываем уведомление об успешной авторизации
      addToast('Successfully logged in! Welcome back!', 'info', 3000);
      // Перенаправляем на dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to log in';
      // Показываем уведомление об ошибке
      addToast(errorMessage, 'error', 5000);
      setShake(true); // запускаем тряску
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Box
          sx={{
            animation: shake
              ? `${shakeAnimation} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both`
              : 'none'
          }}
          onAnimationEnd={() => setShake(false)} // флаг сброса анимации
        >
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              required
              disabled={loading}
              slotProps={{
                htmlInput: {
                  'aria-label': 'Email'
                }
              }}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              required
              disabled={loading}
              slotProps={{
                htmlInput: {
                  'aria-label': 'Password'
                }
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading || !email.trim() || !password.trim()}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <LinkRouter to="/forgot-password" style={{ textDecoration: 'none' }}>
                <Button color="primary" size="small">Forgot your password?</Button>
              </LinkRouter>
            </Box>
          </Box>
          <Typography align="center">
            Don't have an account?{' '}
            <Link component={LinkRouter} to="/register" underline="hover">Register</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
});

export default Login;
