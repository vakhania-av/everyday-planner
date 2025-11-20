import { Box, Card, CardContent, Grid, LinearProgress, Typography } from "@mui/material";
import { CheckCircle, Schedule, TrendingDown, TrendingUp } from "@mui/icons-material";
import { observer } from "mobx-react-lite";
import { useTaskStore } from "../../hooks/useStores";

// Dashboard с аналитикой задач
const StatsCards = observer(() => {
  const { stats } = useTaskStore();

  const statCards = [
    {
      title: 'Total tasks',
      value: stats.total,
      icon: <Schedule color="primary" />,
      color: 'primary'
    },
    {
      title: 'Completed tasks',
      value: stats.completed,
      icon: <CheckCircle color="success" />,
      color: 'success'
    },
    {
      title: 'Tasks in progress',
      value: stats.pending,
      icon: <TrendingUp color="warning" />,
      color: 'warning'
    },
    {
      title: 'Overdue tasks',
      value: stats.overdue,
      icon: <TrendingDown color="error" />,
      color: 'error'
    }
  ];

  return (
    <Grid container spacing={3}>
      {statCards.map((card, index) => (
        <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{
            height: '100%',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: 4
            }
          }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography color="textSecondary" gutterBottom variant="h6">
                  {card.title}
                </Typography>
                {card.icon}
              </Box>
              <Typography component="div" color={card.color} variant="h4">
                {card.value}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
      {/* Progress Card */}
      <Grid sx={{ margin: '0 auto' }}>
        <Card>
          <CardContent>
            <Box>
              <Typography variant="h6">Current progress</Typography>
              <Typography variant="h6" color="primary">
                {stats.completionRate}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={stats.completionRate}
              sx={{ height: 10, borderRadius: 5 }}
              color={stats.completionRate > 70 ? 'success' : (stats.completionRate > 30 ? 'warning' : 'error')}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
});

export default StatsCards;
