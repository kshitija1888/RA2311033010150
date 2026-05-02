'use client';

import {
  Card,
  CardContent,
  Chip,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  Campaign as EventIcon,
  Assessment as ResultIcon,
  Work as PlacementIcon,
  MarkEmailRead as ReadIcon,
  FiberManualRecord as DotIcon,
} from '@mui/icons-material';
import { Notification, NotificationType } from '@/types';

interface Props {
  notification: Notification;
  isRead: boolean;
  onMarkRead: (id: string) => void;
  isPriority?: boolean;
}

const TYPE_CONFIG: Record<
  NotificationType,
  { color: 'primary' | 'success' | 'warning'; icon: React.ReactNode; label: string }
> = {
  Placement: { color: 'success', icon: <PlacementIcon fontSize="small" />, label: 'Placement' },
  Result: { color: 'primary', icon: <ResultIcon fontSize="small" />, label: 'Result' },
  Event: { color: 'warning', icon: <EventIcon fontSize="small" />, label: 'Event' },
};

export default function NotificationCard({ notification, isRead, onMarkRead, isPriority }: Props) {
  const cfg = TYPE_CONFIG[notification.Type];
  const formattedTime = new Date(notification.Timestamp).toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card
      elevation={isPriority ? 4 : isRead ? 0 : 2}
      sx={{
        mb: 1.5,
        borderLeft: '4px solid',
        borderColor: isRead ? 'divider' : `${cfg.color}.main`,
        bgcolor: isRead ? 'background.paper' : isPriority ? `${cfg.color}.50` : 'background.paper',
        opacity: isRead ? 0.75 : 1,
        transition: 'all 0.2s ease',
        '&:hover': { elevation: 6, transform: 'translateX(2px)' },
        position: 'relative',
      }}
    >
      <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
        <Box display="flex" alignItems="flex-start" gap={1.5}>
          {!isRead && (
            <DotIcon
              sx={{ color: `${cfg.color}.main`, fontSize: 10, mt: 0.8, flexShrink: 0 }}
            />
          )}
          <Box flex={1} minWidth={0}>
            <Box display="flex" alignItems="center" gap={1} mb={0.5} flexWrap="wrap">
              <Chip
                icon={cfg.icon}
                label={cfg.label}
                color={cfg.color}
                size="small"
                variant={isRead ? 'outlined' : 'filled'}
              />
              {isPriority && (
                <Chip label="Priority" size="small" color="error" variant="outlined" />
              )}
              <Typography variant="caption" color="text.secondary" ml="auto">
                {formattedTime}
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{
                fontWeight: isRead ? 400 : 500,
                color: isRead ? 'text.secondary' : 'text.primary',
                wordBreak: 'break-word',
              }}
            >
              {notification.Message}
            </Typography>
            <Typography variant="caption" color="text.disabled" sx={{ fontSize: '0.65rem' }}>
              ID: {notification.ID}
            </Typography>
          </Box>
          {!isRead && (
            <Tooltip title="Mark as read">
              <IconButton size="small" onClick={() => onMarkRead(notification.ID)} sx={{ flexShrink: 0 }}>
                <ReadIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      </CardContent>
    </Card>
  );
}
