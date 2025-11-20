import { Alert, Box, Button, Container, Paper, TextField, Typography } from "@mui/material";
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendPasswordReset } from "../../api/auth";
import { DefaultSettings } from "@/const";

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    try {
      setError('');
      setSuccess('');
      setLoading(true);

      await sendPasswordReset(email);

      setSuccess('Password reset instructions have been sent to your email');
      setTimeout(() => navigate('/login'), DefaultSettings.TimeoutDelay);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to send reset instructions';

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Forgot Password
        </Typography>
        <Typography variant="body1" align="center" sx={{ mb: 3 }}>
          Enter your email address and we'll send you instructions to reset your password.
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email Address"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(evt) => setEmail(evt.target.value)}
            required
            disabled={loading}
            slotProps={{
              htmlInput: {
                'aria-label': 'Email address'
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={loading || !email.trim()}
            sx={{ mt: 3, mb: 2 }}
          >
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Link to='/login' style={{ textDecoration: 'none' }}>
              <Button color="primary">Back to Login</Button>
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
