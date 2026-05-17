type LogLevel = 'info' | 'warn' | 'error' | 'debug';

const format = (level: LogLevel, message: string, meta?: unknown) => {
  const timestamp = new Date().toISOString();
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
};

export const logger = {
  info: (message: string, meta?: unknown) => console.log(format('info', message, meta)),
  warn: (message: string, meta?: unknown) => console.warn(format('warn', message, meta)),
  error: (message: string, meta?: unknown) => console.error(format('error', message, meta)),
  debug: (message: string, meta?: unknown) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(format('debug', message, meta));
    }
  },
};
