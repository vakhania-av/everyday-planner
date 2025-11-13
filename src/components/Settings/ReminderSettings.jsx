import { observer } from "mobx-react-lite";
import { useReminderStore } from "../../hooks/useStores";
import { Box, Card, CardContent, FormControlLabel, IconButton, List, ListItem, ListItemText, Switch, TextField, Typography } from "@mui/material";
import { Delete, Notifications } from "@mui/icons-material";
import dayjs from "dayjs";

const ReminderSettings = observer(() => {
  const { enabled, notificationTime, upcomingReminders, removeReminder, setNotificationTime, setEnabled } = useReminderStore();

  const handleTimeChange = (evt) => setNotificationTime(evt.target.value);

  const handleToggle = (evt) => setEnabled(evt.target.checked);

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Reminders
        </Typography>

        <FormControlLabel
          control={
            <Switch
              checked={enabled}
              onChange={handleToggle}
              color="primary"
            />
          }
          label="Turn on reminders"
        />

        {enabled && (
          <Box sx={{ mt: 2 }}>
            <TextField
              label="Время ежедневного дайджеста"
              type="time"
              value={notificationTime}
              onChange={handleTimeChange}
              slotProps={{
                inputLabel: {
                  shrink: true
                }
              }}
              fullWidth
            />

            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }}>
              Upcoming reminders:
            </Typography>

            <List dense>
              {upcomingReminders?.map((reminder) => (
                <ListItem
                  key={reminder.id}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      onClick={() => removeReminder(reminder.id)}
                      size="small"
                    >
                      <Delete />
                    </IconButton>
                  }
                >
                  <Notifications sx={{ mr: 2, fontSize: 20 }} />
                  <ListItemText
                    primary={reminder.taskTitle}
                    secondary={`${dayjs(reminder.deadline).format('DD MMM HH:mm')} - ${reminder.reminderType}`}
                  />
                </ListItem>
              ))}
              {!upcomingReminders.length && (
                <ListItem>
                  <ListItemText
                    primary="No upcoming reminders"
                    slotProps={{
                      primary: {
                        color: 'text.secondary',
                        fontStyle: 'italic'
                      }
                    }}
                  />
                </ListItem>
              )}
            </List>
          </Box>
        )}
      </CardContent>
    </Card>
  );
});

export default ReminderSettings;
