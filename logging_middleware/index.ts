import axios from 'axios';

type Stack = 'backend' | 'frontend';
type Level = 'debug' | 'info' | 'warn' | 'error' | 'fatal';
type Package =
  | 'cache' | 'controller' | 'cron_job' | 'db' | 'domain'
  | 'handler' | 'repository' | 'route' | 'service'
  | 'api' | 'component' | 'hook' | 'page' | 'state' | 'style'
  | 'auth' | 'config' | 'middleware' | 'utils';

const LOG_API = 'http://20.207.122.201/evaluation-service/logs';

let authToken: string | null = null;

export function setLoggerToken(token: string) {
  authToken = token;
}

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
): Promise<void> {
  if (!authToken) {
    console.warn('[Logger] No auth token set. Call setLoggerToken() first.');
    return;
  }

  try {
    await axios.post(
      LOG_API,
      { stack, level, package: pkg, message },
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
  } catch (err) {
    console.error('[Logger] Failed to send log:', err);
  }
}