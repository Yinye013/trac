import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Request, Response } from 'express';

/**
 * Catches every exception thrown anywhere in the app (known HttpExceptions
 * like NotFoundException/BadRequestException, and anything unexpected) and
 * formats them into one consistent JSON shape. The client never sees a stack
 * trace regardless of what actually failed — the real error (with stack) is
 * always logged server-side via Nest's Logger so nothing is lost for
 * debugging, it's just not exposed in the HTTP response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const isHttpException = exception instanceof HttpException;
    const statusCode = isHttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = isHttpException
      ? this.extractMessage(exception)
      : 'Internal server error';

    this.logger.error(
      `${request.method} ${request.url} -> ${statusCode}: ${
        exception instanceof Error ? exception.message : String(exception)
      }`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      success: false,
      message,
      statusCode,
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessage(exception: HttpException): string | string[] {
    const exceptionResponse = exception.getResponse();
    if (typeof exceptionResponse === 'string') {
      return exceptionResponse;
    }
    const body = exceptionResponse as { message?: string | string[] };
    // Not every HttpException body has a `.message` field (e.g. Terminus's
    // health-check failures carry a { status, info, error, details } shape
    // instead) — fall back to the exception's own Error.message, which
    // every HttpException has, rather than a generic placeholder.
    return body.message ?? exception.message;
  }
}
