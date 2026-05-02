'use client';

import {
  Box, Paper, Typography, TextField, Button, Alert, Divider, Tabs, Tab
} from '@mui/material';
import { Key as KeyIcon, Login as LoginIcon } from '@mui/icons-material';
import { useState } from 'react';
import { authenticate, setAuthToken } from '@/services/api';

interface Props {
  onToken: (token: string) => void;
}

export default function AuthSetup({ onToken }: Props) {
  const [tab, setTab] = useState(0);
  const [token, setToken] = useState('');
  const [creds, setCreds] = useState({ email: '', name: '', rollNo: '', accessCode: '', clientID: '', clientSecret: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTokenSubmit = () => {
    if (token.trim()) {
      setAuthToken(token.trim());
      onToken(token.trim());
    }
  };

  const handleAuth = async () => {
    setLoading(true);
    setError('');
    try {
      const t = await authenticate(creds);
      onToken(t);
    } catch {
      setError('Authentication failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center" bgcolor="grey.100">
      <Paper sx={{ p: 4, maxWidth: 480, width: '100%', m: 2 }} elevation={3}>
        <Box textAlign="center" mb={3}>
          <KeyIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5" fontWeight={700}>Notification Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Affordmed Campus Hiring</Typography>
        </Box>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} centered sx={{ mb: 3 }}>
          <Tab label="Use Token" />
          <Tab label="Authenticate" />
        </Tabs>

        {tab === 0 ? (
          <Box display="flex" flexDirection="column" gap={2}>
            <TextField
              label="Bearer Token"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              multiline
              rows={3}
              fullWidth
              size="small"
              placeholder="Paste your access_token here..."
            />
            <Button variant="contained" onClick={handleTokenSubmit} disabled={!token.trim()} fullWidth>
              Load Dashboard
            </Button>
          </Box>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            {(['email', 'name', 'rollNo', 'accessCode', 'clientID', 'clientSecret'] as const).map((field) => (
              <TextField
                key={field}
                label={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                value={creds[field]}
                onChange={(e) => setCreds(p => ({ ...p, [field]: e.target.value }))}
                size="small"
                fullWidth
                type={field === 'clientSecret' ? 'password' : 'text'}
              />
            ))}
            {error && <Alert severity="error">{error}</Alert>}
            <Button
              variant="contained"
              onClick={handleAuth}
              disabled={loading}
              startIcon={<LoginIcon />}
              fullWidth
            >
              {loading ? 'Authenticating...' : 'Authenticate & Load'}
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
