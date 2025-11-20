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
    const now = dayjs();
    const deadlineTime = dayjs(deadline);
    const hoursUntil = deadlineTime.diff(now, 'hour');
    const minutesUntil = deadlineTime.diff(now, 'minute');

    switch (true) {
      case minutesUntil < 0: return { color: 'error', label: 'Overdue', icon: <Warning /> };
      case minutesUntil < 60: return { color: 'error', label: `In ${minutesUntil} min.`, icon: <Warning /> };
      case hoursUntil < 24: return { color: 'warning', label: `In ${hoursUntil} hours`, icon: <Warning /> };
      case hoursUntil <= 48: return { color: 'warning', label: `In ${Math.floor(hoursUntil / 24)} hours`, icon: <Warning /> };
      default: return { color: 'info', label: `In ${Math.floor(hoursUntil / 24)} days`, icon: <Schedule /> };
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
