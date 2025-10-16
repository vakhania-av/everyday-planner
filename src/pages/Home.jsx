import { Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import Header from "../components/Layout/Header";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "../components/Notifications/Notifications";

export default function Home() {
  const { currentUser } = useAuth();

  const content = currentUser ? (
    <Grid container spacing={3} sx={{ justifyContent: 'center' }} >
      <Grid size={{ xs: 12, md: 6 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom>
            Welcome back, {currentUser.name}
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            You've successfully logged in. Start managing your tasks or update your profile settings.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="contained" component={Link} to="/dashboard">Go to Dashboard</Button>
            <Button variant="outlined" component={Link} to="/profile">My Profile</Button>
          </Box>
        </Paper>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <Notifications />
      </Grid>
    </Grid>
  ) : (
    <Box sx={{ textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
        <Button variant="contained" size="large" component={Link} to="/login">Login</Button>
        <Button variant="outlined" size="large" component={Link} to="/register">Register</Button>
      </Box>
    </Box>
  );

  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
        <Typography variant="h2" align="center" gutterBottom>
          Welcome to EveryDay Planner
        </Typography>
        <Typography variant="h5" align="center" gutterBottom sx={{ mb: 4 }}>
          Organize your work and life with simple todo lists
        </Typography>
        {content}
      </Container>
    </>
  );
}
