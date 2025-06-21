export enum LogLevel {
  ERROR = "ERROR",
  WARN = "WARN",
  INFO = "INFO",
  DEBUG = "DEBUG",
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, any> | undefined;
  error?: Error | undefined;
}

export class Logger {
  private static isDevelopment = process.env.NODE_ENV === "development";

  static error(message: string, context?: Record<string, any>, error?: Error) {
    this.log(LogLevel.ERROR, message, context, error);
  }

  static warn(message: string, context?: Record<string, any>) {
    this.log(LogLevel.WARN, message, context);
  }

  static info(message: string, context?: Record<string, any>) {
    this.log(LogLevel.INFO, message, context);
  }

  static debug(message: string, context?: Record<string, any>) {
    if (this.isDevelopment) {
      this.log(LogLevel.DEBUG, message, context);
    }
  }

  private static log(
    level: LogLevel,
    message: string,
    context?: Record<string, any>,
    error?: Error
  ) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(context && { context }),
      ...(error && { error }),
    };

    const logString = this.formatLogEntry(logEntry);

    switch (level) {
      case LogLevel.ERROR:
        console.error(logString);
        break;
      case LogLevel.WARN:
        console.warn(logString);
        break;
      case LogLevel.INFO:
        console.info(logString);
        break;
      case LogLevel.DEBUG:
        console.debug(logString);
        break;
    }
  }

  private static formatLogEntry(entry: LogEntry): string {
    let formatted = `[${entry.timestamp}] ${entry.level}: ${entry.message}`;

    if (entry.context && Object.keys(entry.context).length > 0) {
      formatted += ` | Context: ${JSON.stringify(entry.context)}`;
    }

    if (entry.error) {
      formatted += ` | Error: ${entry.error.message}`;
      if (this.isDevelopment && entry.error.stack) {
        formatted += ` | Stack: ${entry.error.stack}`;
      }
    }

    return formatted;
  }
}
