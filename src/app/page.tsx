'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  Badge,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  Paper,
} from '@mui/material';
import {
  Notifications as BellIcon,
  Logout as LogoutIcon,
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import AuthSetup from '@/components/AuthSetup';
import FilterBar from '@/components/FilterBar';
import NotificationList from '@/components/NotificationList';
import PaginationControls from '@/components/PaginationControls';
import PriorityInbox from '@/components/PriorityInbox';
import { useNotifications } from '@/hooks/useNotifications';

export default function HomePage() {
  const [token, setToken] = useState<string | null>(null);

  const {
    notifications,
    priorityNotifications,
    loading,
    error,
    page,
    hasMore,
    filterType,
    readIds,
    setPage,
    setFilterType,
    markRead,
    markAllRead,
    reload,
  } = useNotifications(token);

  if (!token) {
    return <AuthSetup onToken={setToken} />;
  }

  const unreadCount = notifications.filter((n) => !readIds.has(n.ID)).length;

  return (
    <Box minHeight="100vh" bgcolor="background.default">
      <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ gap: 1 }}>
          <BellIcon color="primary" />
          <Typography variant="h6" fontWeight={700} flex={1} color="primary">
            Campus Notifications
          </Typography>
          <Badge badgeContent={unreadCount} color="error" max={99}>
            <BellIcon color="action" />
          </Badge>
          <Tooltip title="Refresh">
            <IconButton onClick={reload} disabled={loading} size="small">
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Logout">
            <IconButton onClick={() => setToken(null)} size="small" color="error">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 3 }}>
        {/* Stats row */}
        <Box display="flex" gap={1} mb={3} flexWrap="wrap">
          <Chip label={`${notifications.length} notifications`} variant="outlined" size="small" />
          {unreadCount > 0 && (
            <Chip label={`${unreadCount} unread`} color="primary" size="small" />
          )}
          <Chip label={`Page ${page}`} variant="outlined" size="small" color="secondary" />
        </Box>

        {/* Priority Inbox */}
        <PriorityInbox
          notifications={priorityNotifications}
          readIds={readIds}
          onMarkRead={markRead}
        />

        {/* All Notifications */}
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
          <Typography variant="subtitle1" fontWeight={700} mb={2}>
            All Notifications
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <FilterBar
            filterType={filterType}
            onChange={(type) => { setFilterType(type); setPage(1); }}
            unreadCount={unreadCount}
            onMarkAllRead={markAllRead}
          />

          <NotificationList
            notifications={notifications}
            loading={loading}
            error={error}
            readIds={readIds}
            onMarkRead={markRead}
          />

          <PaginationControls
            page={page}
            hasMore={hasMore}
            loading={loading}
            onPrev={() => setPage((p) => Math.max(1, p - 1))}
            onNext={() => setPage((p) => p + 1)}
          />
        </Paper>
      </Container>
    </Box>
  );
}
