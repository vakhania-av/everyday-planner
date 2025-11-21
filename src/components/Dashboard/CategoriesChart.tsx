import { observer } from "mobx-react-lite";
import { Box, Card, CardContent, Typography } from "@mui/material";
import { Cell, Pie, PieChart, ResponsiveContainer } from "recharts";
import { COLORS } from "../../const";

import { useTaskStore } from "../../hooks/useStores";
import type { ITask } from "@/types";

// Категории задач
const CategoriesChart = observer(() => {
  const { tasks } = useTaskStore();

  const categoryData = Object.entries(tasks.reduce<Record<string, number>>((acc, task: ITask) => {
    const category = task.category || 'other';

    acc[category] = (acc[category] || 0) + 1;

    return acc
  }, {})).map(([name, value]) => ({ name, value }));

  return (
    <Card sx={{ mt: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          By categories
        </Typography>
        <Box sx={{ height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: {name: string, percent: unknown}) => {
                  const pct = typeof percent === 'number' ? percent : 0;
                  return `${name} (${(pct * 100).toFixed(0)}%)`
                }}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {categoryData.map((_, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
});

export default CategoriesChart;
