import { Box, Card, CardContent, Typography } from "@mui/material";
import { observer } from "mobx-react-lite";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTaskStore } from "../../hooks/useStores";

// График выполнения задач по дням
const TasksChart = observer(() => {
  const { chartData } = useTaskStore();

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Last week activity
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="created" fill="#8884d8" name="Tasks created" />
              <Bar dataKey="completed" fill="#82ca9d" name="Tasks completed" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

export default TasksChart;
