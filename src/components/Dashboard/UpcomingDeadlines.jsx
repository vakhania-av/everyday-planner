import { observer } from "mobx-react-lite";
import { useTaskStore } from "../../hooks/useStores";
import { Card, CardContent, Chip, List, ListItem, ListItemText, Typography } from "@mui/material";
import dayjs from "dayjs";
import { Schedule, Warning } from "@mui/icons-material";

// Предстоящие дедлайны
const UpcomingDeadlines = observer(() => {
  const { tasks } = useTaskStore();

  const upcomingTasks = tasks
    .filter((task) => !task.completed && task.deadline)
    .sort((a, b) => dayjs(a.deadline).diff(dayjs(b.deadline)))
    .slice(0, 5);

  const getDeadlineStatus = (deadline) => {
    const daysUntil = dayjs(deadline).diff(dayjs(), 'day');

    switch (true) {
      case daysUntil < 0: return { color: 'error', label: 'Overdue', icon: <Warning /> };
      case daysUntil === 0: return { color: 'warning', label: 'Today', icon: <Warning /> };
      case daysUntil <= 2: return { color: 'warning', label: `In ${daysUntil} days`, icon: <Schedule /> };
      default: return { color: 'info', label: `In ${daysUntil} days`, icon: <Schedule /> };
    }
  };

  if (!upcomingTasks.length) {
    <ListItem>
      <ListItemText
        primary="No upcoming deadlines"
        slotProps={{
          primary: {
            color: "text.secondary",
            fontStyle: "italic"
          }
        }}
      />
    </ListItem>
  }

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Upcoming deadlines
        </Typography>
        <List>
          {upcomingTasks.map((task) => {
            const status = getDeadlineStatus(task.deadline);

            return (
              <ListItem>
                <ListItemText
                  primary={task.title}
                  secondary={dayjs(task.deadline).format('DD.MM.YYYY')}
                />
                <Chip
                  icon={status.icon}
                  label={status.label}
                  color={status.color}
                  variant="outlined"
                  size="small"
                />
              </ListItem>
            );
          })}
        </List>
      </CardContent>
    </Card>
  );
});

export default UpcomingDeadlines;
