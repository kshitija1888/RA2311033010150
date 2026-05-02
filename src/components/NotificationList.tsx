'use client';

import { Box, CircularProgress, Alert, Typography } from '@mui/material';
import { Notifications as EmptyIcon } from '@mui/icons-material';
import { Notification } from '@/types';
import NotificationCard from './NotificationCard';

interface Props {
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  readIds: Set<string>;
  onMarkRead: (id: string) => void;
}

export default function NotificationList({ notifications, loading, error, readIds, onMarkRead }: Props) {
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={6}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>;
  }

  if (notifications.length === 0) {
    return (
      <Box textAlign="center" py={8} color="text.secondary">
        <EmptyIcon sx={{ fontSize: 48, mb: 1, opacity: 0.3 }} />
        <Typography variant="body2">No notifications found</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isRead={readIds.has(n.ID)}
          onMarkRead={onMarkRead}
        />
      ))}
    </Box>
  );
}
