import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Avatar, Box, Button, Container, Divider, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser, updateProfile, logout } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      setError('');
      setSuccess('');
      setLoading(true);
      await updateProfile({ name, email });
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError('Failed to update profile: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!currentUser) return null;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 56, height: 56, mr: 2 }}>
            {currentUser.name?.charAt(0).toUpperCase()}
          </Avatar>
          <Typography variant="h4">My Profile</Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          {error && (
            <Typography color="error" align="center" sx={{ mb: 2 }}>
              {error}
            </Typography>)
          }
          {success && (
            <Typography color="success.main" align="center" sx={{ mb: 2 }}>
              {success}
            </Typography>)
          }

          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(evt) => setName(evt.target.value)} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(evt) => setEmail(evt.target.value)} required />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Update Profile'}
            </Button>
            <Button
              sx={{ ml: 'auto', mr: 1 }}
              variant="outlined"
              size="large"
              component={Link}
              to="/"
            >
              Back
            </Button>
            <Button variant="outlined" color="error" onClick={logout}>Logout</Button>
          </Box>
        </Box>

      </Paper>
    </Container>
  );
}
