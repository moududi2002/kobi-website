// apps/api/src/common/logger/app-logger.service.ts
import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable({ scope: Scope.DEFAULT })
export class AppLogger implements LoggerService {
  private readonly isProd: boolean;

  constructor(config: ConfigService) {
    this.isProd = config.get<string>('nodeEnv') === 'production';
  }

  log(message: any, context?: string) {
    this.write('log', message, context);
  }
  error(message: any, trace?: string, context?: string) {
    this.write('error', message, context, trace);
  }
  warn(message: any, context?: string) {
    this.write('warn', message, context);
  }
  debug(message: any, context?: string) {
    if (!this.isProd) this.write('debug', message, context);
  }
  verbose(message: any, context?: string) {
    if (!this.isProd) this.write('verbose', message, context);
  }

  private write(level: string, message: any, context?: string, trace?: string) {
    const timestamp = new Date().toISOString();
    if (this.isProd) {
      const payload = {
        timestamp,
        level,
        context: context || 'App',
        message:
          typeof message === 'string' ? message : JSON.stringify(message),
        ...(trace ? { trace } : {}),
      };
      // eslint-disable-next-line no-console
      console.log(JSON.stringify(payload));
    } else {
      const prefix = `[${timestamp}] [${level.toUpperCase()}] [${context || 'App'}]`;
      // eslint-disable-next-line no-console
      console.log(`${prefix} ${message}`, trace ? `\n${trace}` : '');
    }
  }
}