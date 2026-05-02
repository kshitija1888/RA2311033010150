'use client';

import { Box, Typography, Paper, Divider } from '@mui/material';
import { Star as StarIcon } from '@mui/icons-material';
import { Notification } from '@/types';
import NotificationCard from './NotificationCard';

interface Props {
  notifications: Notification[];
  readIds: Set<string>;
  onMarkRead: (id: string) => void;
}

export default function PriorityInbox({ notifications, readIds, onMarkRead }: Props) {
  if (notifications.length === 0) return null;

  return (
    <Paper variant="outlined" sx={{ mb: 3, p: 2, bgcolor: 'grey.50', borderRadius: 2 }}>
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <StarIcon color="warning" />
        <Typography variant="subtitle1" fontWeight={700}>
          Priority Inbox
        </Typography>
        <Typography variant="caption" color="text.secondary">
          (Top {notifications.length} — Placement {'>'} Result {'>'} Event)
        </Typography>
      </Box>
      <Divider sx={{ mb: 2 }} />
      {notifications.map((n) => (
        <NotificationCard
          key={n.ID}
          notification={n}
          isRead={readIds.has(n.ID)}
          onMarkRead={onMarkRead}
          isPriority
        />
      ))}
    </Paper>
  );
}
