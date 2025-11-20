import { observer } from "mobx-react-lite";
import { Box, Container, Grid } from "@mui/material";

import Header from "../components/Layout/Header";
import TaskList from "../components/Tasks/TaskList";
import LoadingSpinner from "../components/Layout/LoadingSpinner";
import StatsCards from "../components/Dashboard/StatsCards";
import TasksChart from "../components/Dashboard/TasksChart";
import CategoriesChart from "../components/Dashboard/CategoriesChart";
import UpcomingDeadlines from "../components/Dashboard/UpcomingDeadlines";
import GoalsProgress from "../components/Dashboard/GoalsProgress";

import { useAuthStore } from "../hooks/useStores";

const Dashboard = observer(() => {
  const { loading } = useAuthStore();

  if (loading) {
    return (
      <>
        <Header />
        <LoadingSpinner message="Загружаем Ваши задачи..." />
      </>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        {/* Статистика */}
        <StatsCards />

        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Графики и аналитика */}
          <Grid size={{ xs: 12, md: 6 }}>
            <GoalsProgress />
            <UpcomingDeadlines />
            <TasksChart />
            <CategoriesChart />
          </Grid>

          {/* Боковая панель с дедлайнами и быстрыми действиями */}
          <Grid size={{ xs: 12, md: 6 }}>

            {/* Быстрые действия */}
            <Box sx={{ mt: 3 }}>
              <TaskList />
            </Box>
          </Grid>
        </Grid>
      </Container>
    </>
  );
});

export default Dashboard;
