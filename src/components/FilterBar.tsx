'use client';

import { Box, ToggleButton, ToggleButtonGroup, Typography, Button } from '@mui/material';
import {
  Campaign as EventIcon,
  Assessment as ResultIcon,
  Work as PlacementIcon,
  FilterList as AllIcon,
} from '@mui/icons-material';
import { NotificationType } from '@/types';

interface Props {
  filterType: NotificationType | '';
  onChange: (type: NotificationType | '') => void;
  unreadCount: number;
  onMarkAllRead: () => void;
}

export default function FilterBar({ filterType, onChange, unreadCount, onMarkAllRead }: Props) {
  return (
    <Box
      display="flex"
      alignItems="center"
      flexWrap="wrap"
      gap={2}
      mb={2}
      justifyContent="space-between"
    >
      <Box display="flex" alignItems="center" gap={1} flexWrap="wrap">
        <Typography variant="body2" color="text.secondary" fontWeight={500}>
          Filter:
        </Typography>
        <ToggleButtonGroup
          value={filterType}
          exclusive
          onChange={(_, val) => onChange(val ?? '')}
          size="small"
          color="primary"
        >
          <ToggleButton value="">
            <AllIcon sx={{ mr: 0.5 }} fontSize="small" />
            All
          </ToggleButton>
          <ToggleButton value="Placement">
            <PlacementIcon sx={{ mr: 0.5 }} fontSize="small" />
            Placement
          </ToggleButton>
          <ToggleButton value="Result">
            <ResultIcon sx={{ mr: 0.5 }} fontSize="small" />
            Result
          </ToggleButton>
          <ToggleButton value="Event">
            <EventIcon sx={{ mr: 0.5 }} fontSize="small" />
            Event
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {unreadCount > 0 && (
        <Button
          size="small"
          variant="text"
          color="secondary"
          onClick={onMarkAllRead}
          sx={{ textTransform: 'none' }}
        >
          Mark all as read ({unreadCount})
        </Button>
      )}
    </Box>
  );
}
