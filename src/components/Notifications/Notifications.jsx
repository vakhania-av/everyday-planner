import { Assignment, CheckCircle, Delete, Edit, Notifications as NotificationsIcon, Schedule, ExpandMore, ExpandLess } from "@mui/icons-material";
import { Badge, Box, Button, CircularProgress, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { formatTime } from "../../utils.js";
import { getNotifications, markAllNotificationsAsRead, markNotificationAsRead } from "../../api/notifications.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [displayedNotifications, setDisplayedNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const notificationsPerPage = 5;

  const { currentUser } = useAuth();

  const fetchNotifications = async () => {
    if (!currentUser) {
      setLoading(false);
      setNotifications([]);
      setDisplayedNotifications([]);
      setUnreadCount(0);

      return;
    }
    try {
      setLoading(true);

      const response = await getNotifications();

      if (response?.success) {
        setNotifications(response.notifications);
        setUnreadCount(response.unreadCount);
        updateDisplayedNotifications(response.notifications, 1);
        setHasMore(response.notifications.length > notificationsPerPage);
      }
    } catch (err) {
      setError('Failed to load notifications');

      console.error('Error: ', err);
    } finally {
      setLoading(false);
    }
  };

  const updateDisplayedNotifications = (allNotifications, currentPage) => {
    const endIndex = currentPage * notificationsPerPage;

    setDisplayedNotifications(allNotifications.slice(0, endIndex));
    setHasMore(allNotifications.length > endIndex);
  };

  const loadMore = () => {
    const nextPage = page + 1;

    setPage(nextPage);
    updateDisplayedNotifications(notifications, nextPage);
  };

  const toggleExpanded = () => {
    if (!expanded && page === 1) {
      loadMore();
    }

    setExpanded(!expanded);
  };

  useEffect(() => {
    fetchNotifications();
  }, [currentUser]);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);

      // Обновляем локальное состояние
      setNotifications((prev) => prev.map((notif) => notif.id === notificationId ? { ...notif, is_read: true } : notif));
      setDisplayedNotifications((prev) => prev.map((notif) => notif.id === notificationId ? { ...notif, is_read: true } : notif));
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read: ', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();

      // Обновляем локальное состояние
      setNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      setDisplayedNotifications((prev) => prev.map((notif) => ({ ...notif, is_read: true })));
      setUnreadCount(0);
    } catch (err) {
      console.error('Error marking all notifications as read: ', err);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'task_completed': return <CheckCircle color="success" />;
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
    notifications.map((notification) => (
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
        onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
      >
        <ListItemIcon>
          {getIcon(notification.type)}
        </ListItemIcon>
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
    <Paper sx={{ p: 2, maxHeight: expanded ? '400px' : 'auto', oveflow: 'hidden' }}>
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
          {unreadCount > 0 && <Button size="small" onClick={handleMarkAllAsRead}>Mark all read</Button>}
          <IconButton
            size="small"
            onClick={toggleExpanded}
            sx={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s'
            }}>
            <ExpandMore />
          </IconButton>
        </Box>

      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <Box sx={{
        maxHeight: expanded ? '300px' : '200px',
        overflow: 'auto',
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


      {hasMore && expanded && (
        <Box>
          <Button
            size="small"
            onClick={loadMore}
            disabled={!hasMore}
          >
            Load more ({notifications.length - displayedNotifications.length} remaining)
          </Button>
        </Box>
      )}

      {!expanded && notifications.length > notificationsPerPage && (
        <Box sx={{ textAlign: 'center', mt: 1 }}>
          <Button
            size="small"
            onClick={toggleExpanded}
          >
            Show all ({notifications.length - notificationsPerPage} more)
          </Button>
        </Box>
      )}
      
    </Paper>
  );
}
