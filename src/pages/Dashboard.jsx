import { Container } from "@mui/material";
import Header from "../components/Layout/Header";
import TaskList from "../components/Tasks/TaskList";
import LoadingSpinner from "../components/Layout/LoadingSpinner";
import { observer } from "mobx-react-lite";
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
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <TaskList />
      </Container>
    </>
  );
});

export default Dashboard;
