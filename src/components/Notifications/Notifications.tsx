import {
  Notifications as NotificationsIcon,
  ExpandMore,
  CheckCircle,
  Assignment,
  Edit,
  Delete,
  Schedule
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography
} from "@mui/material";
import { useEffect } from "react";
import { formatTime } from "../../utils";
import { observer } from "mobx-react-lite";
import { useNotificationStore } from "../../hooks/useStores";
import type { INotification } from "@/types/notification";

const Notifications = observer(() => {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    expanded,
    displayedCount,
    notificationsPerPageValue: notificationsPerPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    loadMore,
    toggleExpanded,
    visibleNotifications,
    shouldScroll,
    hasMoreToLoad
  } = useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIcon = (type: string | null | undefined) => {
    switch (type) {
      case 'task_completed': return <CheckCircle color="success" />
      case 'task_created': return <Assignment color="info" />;
      case 'task_updated': return <Edit color="primary" />;
      case 'task_deleted': return <Delete color="error" />;
      case 'task_overdue': return <Schedule color="warning" />;
      default: return <NotificationsIcon color="primary" />;
    }
  };

  if (loading) {
    return (
      <Paper sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
        </Box>
      </Paper>
    );
  }

  const listItemContent = notifications.length ? (
    visibleNotifications.map((notification: INotification) => (
      <ListItem
        key={notification.id}
        sx={{
          backgroundColor: notification.is_read ? 'transparent' : 'action.hover',
          borderRadius: 1,
          mb: 0.5,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: notification.is_read ? 'action.hover' : 'action.selected'
          }
        }}
        onClick={() => !notification.is_read && markAsRead(notification.id)}
      >
        <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
        <ListItemText
          primary={notification.message}
          secondary={formatTime(notification.created_at)}
          slotProps={{
            primary: {
              fontSize: '0.85rem',
              fontWeight: notification.is_read ? 'normal' : 'bold',
              lineHeight: 1.2
            },
            secondary: {
              fontSize: '0.7rem',
              color: notification.is_read ? 'text.secondary' : 'primary.main'
            }
          }}
        />
      </ListItem>
    ))
  ) : (
    <ListItem>
      <ListItemText
        primary="No notifications yet"
        slotProps={{
          primary: {
            fontSize: '0.9rem',
            color: 'text.secondary',
            textAlign: 'center'
          }
        }}
      />
    </ListItem>
  );

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Badge badgeContent={unreadCount} color="error">
            <NotificationsIcon />
          </Badge>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Notifications
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {unreadCount > 0 && (
            <Button size="small" onClick={markAllAsRead}>
              Mark all read
            </Button>
          )}
          {notifications.length > notificationsPerPage && (
            <IconButton
              size="small"
              onClick={toggleExpanded}
              sx={{
                transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s'
              }}>
              <ExpandMore />
            </IconButton>
          )}
        </Box>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{
        maxHeight: '380px',
        overflowY: shouldScroll ? 'auto' : 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px'
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#c1c1c1',
          borderRadius: '4px'
        },
        '&::-webkit-scrollbar-thumb:hover': {
          background: '#a8a8a8'
        }
      }}>
        <List dense>
          {listItemContent}
        </List>
      </Box>

      {/* Кнопки управления */}
      {!expanded && hasMoreToLoad && displayedCount <= notifications.length && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button size="small" onClick={loadMore}>
            Load more ({notifications.length - displayedCount} remaining)
          </Button>
        </Box>
      )}

    </Paper>
  );
});

export default Notifications;
