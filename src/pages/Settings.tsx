import { observer } from "mobx-react-lite";
import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { Link as LinkRouter } from "react-router-dom";

import Header from '../components/Layout/Header';
import ReminderSettings from "../components/Settings/ReminderSettings";

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
                component={LinkRouter}
                to="/"
                sx={{ ml: 'auto', mr: 1 }}
                variant="contained"
                size="large"
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
