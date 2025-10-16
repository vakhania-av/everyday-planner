import { Container } from "@mui/material";
import Header from "../components/Layout/Header";
import TaskList from "../components/Tasks/TaskList";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/Layout/LoadingSpinner";

export default function Dashboard() {
  const { loading } = useAuth();

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
}
