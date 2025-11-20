import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/auth";
import { DefaultSettings } from "@/const";

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');

      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');

      return;
    }

    if (!token) {
      setError('Can\'t receive token');

      return;
    }

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await resetPassword(token, password);
      setSuccess('Password has been reset successfully!');
      setTimeout(() => navigate('/login'), DefaultSettings.TimeoutDelay);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to reset password';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
          <Alert severity="error">Invalid reset link</Alert>
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link to="/forgot-password">
              <Button color="primary">Request new reset link</Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography
          variant="h4"
          align="center"
          gutterBottom
        >
          Reset Password
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(evt) => setPassword(evt.target.value)}
            required
            disabled={loading}
            slotProps={{
              htmlInput: {
                'aria-label': 'New Password'
              }
            }}
          />
          <TextField
            label="Confirm Password"
            type="password"
            fullWidth
            margin="normal"
            value={confirmPassword}
            onChange={(evt) => setConfirmPassword(evt.target.value)}
            required
            disabled={loading}
            slotProps={{
              htmlInput: {
                'aria-label': 'Confirm Password'
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={
              loading ||
              password.length < 6 ||
              confirmPassword.length < 6 ||
              password !== confirmPassword
            }
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <Button color="primary">Back to Login</Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
