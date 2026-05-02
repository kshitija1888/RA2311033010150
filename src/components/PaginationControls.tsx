'use client';

import { Box, Button, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@mui/icons-material';

interface Props {
  page: number;
  hasMore: boolean;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}

export default function PaginationControls({ page, hasMore, loading, onPrev, onNext }: Props) {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" gap={3} mt={3} py={1}>
      <Button
        variant="outlined"
        startIcon={<ArrowBack />}
        onClick={onPrev}
        disabled={page <= 1 || loading}
        size="small"
      >
        Previous
      </Button>
      <Typography variant="body2" color="text.secondary" fontWeight={600}>
        Page {page}
      </Typography>
      <Button
        variant="outlined"
        endIcon={<ArrowForward />}
        onClick={onNext}
        disabled={!hasMore || loading}
        size="small"
      >
        Next
      </Button>
    </Box>
  );
}
