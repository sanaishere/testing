import { ExceptionFilter, Catch, ArgumentsHost, HttpException, BadRequestException } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const error=exception.getResponse()
    console.log(exception,error)
    response
      .status(status)
      .json({
        statusCode: error?400:status,
        timestamp: new Date().toISOString(),
        path: request.url,
        message:error['message']||exception.message||exception

      });
  }
}