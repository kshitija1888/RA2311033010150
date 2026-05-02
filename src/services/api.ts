 import axios from 'axios';
import { FetchParams, NotificationsResponse } from '@/types';

const BASE_URL = '/api/proxy';

const apiClient = axios.create({ baseURL: BASE_URL });

// Token is set after auth — store in module scope
let authToken: string | null = null;

export function setAuthToken(token: string) {
  authToken = token;
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

export async function authenticate(credentials: {
  email: string;
  name: string;
  rollNo: string;
  accessCode: string;
  clientID: string;
  clientSecret: string;
}): Promise<string> {
  const res = await apiClient.post('/auth', credentials);
  const token: string = res.data.access_token;
  setAuthToken(token);
  return token;
}

export async function fetchNotifications(
  params: FetchParams = {}
): Promise<NotificationsResponse> {
  const query: Record<string, string | number> = {};
  if (params.limit) query.limit = params.limit;
  if (params.page) query.page = params.page;
  if (params.notification_type) query.notification_type = params.notification_type;

  const res = await apiClient.get<NotificationsResponse>('/notifications', {
    params: query,
  });
  return res.data;
}