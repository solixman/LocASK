import { Catch, RpcExceptionFilter, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Catch()
export class AllExceptionsFilter implements RpcExceptionFilter<RpcException> {
    catch(exception: any, host: ArgumentsHost): Observable<any> {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        console.error('--- EXCEPTION ---', exception);

        // Handle Microservice Errors
        if (exception.status) {
            status = exception.status;
            message = exception.message;
        } else if (exception.response) {
            status = exception.response.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
            message = exception.response.message || 'Error from microservice';
        }

        return response.status(status).json({
            statusCode: status,
            message: message,
            timestamp: new Date().toISOString(),
        });
    }
}
