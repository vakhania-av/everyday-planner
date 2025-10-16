import { Box, Button, Container, Link, Paper, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../context/ToastContext";

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const { addToast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    if (password.length < 6) {
      return setError('Password must be at least 6 characters!');
    }

    try {
      setError('');
      setLoading(true);

      await register(name, email, password);

      // Показываем уведомление об успешной регистрации
      addToast('Account created successfully! Welcome!', 'success', 3000);
      // Перенаправляем пользователя на dashboard
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err.response?.data?.error || `Failed to register: ${err.message}`;

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
          Register
        </Typography>
        {errorCondition}
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Name"
            fullWidth
            margin="normal"
            value={name}
            onChange={(evt) => setName(evt.target.value)}
            required
          />
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
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <Typography align="center">
            Already have an account?{' '}
            <Link href="/login" underline="hover">
              Login
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
