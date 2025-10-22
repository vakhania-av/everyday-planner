import { useEffect, useState } from "react";
import { Avatar, Box, Button, Container, Divider, Paper, TextField, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { useAuthStore, useUiStore } from "../hooks/useStores";

const Profile = observer(() => {
  const { currentUser, updateProfile, logout } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');

  const { addToast } = useUiStore();

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setInitialName(currentUser.name || '');
      setInitialEmail(currentUser.email || '');
    }
  }, [currentUser]);

  const hasChanges = name !== initialName || email !== initialEmail;

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      setLoading(true);
      await updateProfile({ name, email });
      addToast('Profile updated successfully!', 'success', 3000);
    } catch (err) {
      addToast('Failed to update profile: ' + err.message, 'error', 3000);
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
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={(evt) => setName(evt.target.value)} required disabled={loading} />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={(evt) => setEmail(evt.target.value)} required disabled={loading} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={loading || !hasChanges}
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
            <Button
              variant="outlined"
              color="error"
              onClick={logout}
              disabled={loading}
            >
              Logout
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
});

export default Profile;
