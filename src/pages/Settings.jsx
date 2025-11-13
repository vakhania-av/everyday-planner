import { observer } from "mobx-react-lite";
import Header from '../components/Layout/Header';
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import ReminderSettings from "../components/Settings/ReminderSettings";
import { Link } from "react-router-dom";

const Settings = observer(() => {
  return (
    <>
      <Header />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ReminderSettings />
            <Box sx={{ mt: 3 }}>
              <Button
                sx={{ ml: 'auto', mr: 1 }}
                variant="contained"
                size="large"
                component={Link}
                to="/"
              >
                Back
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default Settings;
