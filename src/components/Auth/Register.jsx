import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { shakeAnimation } from "../../const";
import { useAuthStore, useUiStore } from "../../hooks/useStores";
import { observer } from "mobx-react-lite";

const Register = observer(() => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [shake, setShake] = useState(false);

  const { register } = useAuthStore();
  const { addToast } = useUiStore();
  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (password.length < 6) {
      return addToast('Password must be at least 6 characters!', 'error');
    }

    try {
      setLoading(true);

      await register(name, email, password);
      // Показываем уведомление об успешной регистрации
      addToast('Account created successfully! Welcome!', 'success', 3000);
      // Перенаправляем пользователя на dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to register: ${err.message}`;
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
          sx={{ animation: shake ? `${shakeAnimation} 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both` : 'none' }}
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
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              disabled={loading}
              sx={{ mt: 3, mb: 2 }}
            >
              {loading ? 'Registering...' : 'Register'}
            </Button>
            <Typography align="center">
              Already have an account?{' '}
              <Link href="/login" underline="hover">
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
