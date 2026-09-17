// apps/api/src/common/interceptors/transform.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  timestamp: string;
}

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const response = context.switchToHttp().getResponse();
    const statusCode = response.statusCode;

    return next.handle().pipe(
      map((data) => {
        // If controller already returns the wrapped structure, pass through
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }

        // If it's a paginated response with meta
        if (data && typeof data === 'object' && 'data' in data && 'meta' in data) {
          return {
            success: true,
            statusCode,
            message: 'OK',
            data: data.data,
            meta: data.meta,
            timestamp: new Date().toISOString(),
          } as any;
        }

        return {
          success: true,
          statusCode,
          message: 'OK',
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}