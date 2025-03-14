import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, switchMap } from 'rxjs';
import { extractTokenFromHeader } from '../helpers/extract-jwt-token';
import { Request } from 'express';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    if(context.getType() !== 'http') return next.handle();

    const request =context.switchToHttp().getRequest<Request>();
    const jwt = extractTokenFromHeader(request);

    if(!jwt) return next.handle();

    return this.authService
      .send(
        { cmd: 'decode-jwt' },
        { jwt }
      )
      .pipe(
        switchMap(
          ({user}) => {
            request.user = user;
            return next.handle();
          }
        ),
        catchError(() => next.handle())
      )

    
  }
}
