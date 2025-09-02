import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res: any = exception.getResponse();
      // HttpException có thể trả về object hoặc string
      message =
        typeof res === 'string' ? res : res.message || exception.message;
    }

    // 👇 log full lỗi ra console
    console.error('Exception caught:', exception);

    response.status(status).json({
      success: false,
      data: null,
      message,
      error: exception,
    });
  }
}
