import { ERROR_MESSAGES } from './errors';

interface LogEntry {
  timestamp: number;
  level: 'info' | 'warn' | 'error';
  category: string;
  message: string;
  data?: any;
}

class Logger {
  private logs: LogEntry[] = [];
  private readonly MAX_LOGS = 1000;

  info(category: string, message: string, data?: any) {
    this.addLog('info', category, message, data);
  }

  warn(category: string, message: string, data?: any) {
    this.addLog('warn', category, message, data);
  }

  error(category: string, message: string, data?: any) {
    this.addLog('error', category, message, data);
    this.reportError(category, message, data);
  }

  private addLog(level: LogEntry['level'], category: string, message: string, data?: any) {
    const entry: LogEntry = {
      timestamp: Date.now(),
      level,
      category,
      message,
      data
    };

    this.logs.unshift(entry);
    
    // Trim logs if they exceed max size
    if (this.logs.length > this.MAX_LOGS) {
      this.logs = this.logs.slice(0, this.MAX_LOGS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console[level](`[${category}] ${message}`, data);
    }
  }

  private reportError(category: string, message: string, data?: any) {
    // Send error to monitoring service
    fetch('/api/log/error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        category,
        message,
        data,
        userAgent: navigator.userAgent,
        timestamp: Date.now()
      })
    }).catch(console.error);
  }

  getLogs(category?: string): LogEntry[] {
    return category 
      ? this.logs.filter(log => log.category === category)
      : this.logs;
  }
}

export const logger = new Logger();