import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { useNavigate, Link as LinkRouter } from "react-router-dom";
import { observer } from "mobx-react-lite";

import { shakeAnimation } from "../../const";
import { useAuthStore, useUiStore } from "../../hooks/useStores";

const Register = observer(() => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const { register } = useAuthStore();
  const { addToast } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (password.length < 6) {
      addToast('Password must be at least 6 characters!', 'error');
      setShake(true);

      return;
    }

    try {
      setLoading(true);

      await register(name, email, password);
      // Показываем уведомление об успешной регистрации
      addToast('Account created successfully! Welcome!', 'success', 3000);
      // Перенаправляем пользователя на dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to register';
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
          Register
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
              label="Name"
              fullWidth
              margin="normal"
              value={name}
              onChange={(evt) => setName(evt.target.value)}
              required
              disabled={loading}
              slotProps={{
                htmlInput: {
                  'aria-label': 'Name'
                }
              }}
            />
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
              disabled={loading || !name.trim() || !email.trim() || password.length < 6}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Typography align="center">
              Already have an account?{' '}
              <Link component={LinkRouter} to="/login" underline="hover">
                Login
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
});

export default Register;
