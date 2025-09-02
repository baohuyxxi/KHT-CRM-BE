import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { error } from 'console';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, { success: boolean; data: T; message?: string }>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ success: boolean; data: T; message?: string }> {
    return next.handle().pipe(
      map((res: any) => {
        // Nếu controller return { data, message }
        if (res && typeof res === 'object' && 'data' in res) {
          return {
            success: true,
            message: res.message || 'Request successful',
            data: res.data,
            error: res.error || null,
          };
        }

        // Nếu controller return trực tiếp data
        return {
          success: true,
          message: 'Request successful',
          data: res,
          error: null,
        };
      }),
    );
  }
}
