'use client';

import { useState, useEffect, useCallback } from 'react';
import { Notification, NotificationType } from '@/types';
import { fetchNotifications } from '@/services/api';

const PRIORITY_WEIGHT: Record<NotificationType, number> = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

export function useNotifications(token: string | null) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filterType, setFilterType] = useState<NotificationType | ''>('');
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  const LIMIT = 10;

  const load = useCallback(
    async (pg: number, type: NotificationType | '') => {
      if (!token) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchNotifications({
          limit: LIMIT,
          page: pg,
          notification_type: type || undefined,
        });
        const items = data.notifications ?? [];
        setNotifications(items);
        setHasMore(items.length === LIMIT);
      } catch (e) {
        setError('Failed to load notifications. Check your auth token.');
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  useEffect(() => {
    load(page, filterType);
  }, [page, filterType, load]);

  const markRead = (id: string) => {
    setReadIds((prev) => new Set([...prev, id]));
  };

  const markAllRead = () => {
    setReadIds((prev) => new Set([...prev, ...notifications.map((n) => n.ID)]));
  };

  const priorityNotifications = [...notifications]
    .sort((a, b) => {
      const pw = PRIORITY_WEIGHT[b.Type] - PRIORITY_WEIGHT[a.Type];
      if (pw !== 0) return pw;
      return new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime();
    })
    .slice(0, 3);

  return {
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
    reload: () => load(page, filterType),
  };
}
