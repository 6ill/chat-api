import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, Observable, of, switchMap } from 'rxjs';
import { extractTokenFromHeader } from '../helpers/extract-jwt-token';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: ClientProxy
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    if(context.getType() !== 'http') return false;
    
    const request = context.switchToHttp().getRequest()
    const jwt = extractTokenFromHeader(request);

    if(!jwt) throw new UnauthorizedException('Token not provided');
    
    return this.authService
      .send(
        { cmd: 'verify-jwt' }, {jwt}
      )
      .pipe(
        switchMap(
          ({exp}) => {
            if(!exp) return of(false);
            const tokenExpMs =exp *1000;
            const isJwtValid = Date.now() < tokenExpMs;
            if (!isJwtValid) {
              throw new UnauthorizedException('Token expired');
            }
            return of(isJwtValid);
          }
        ),
        catchError(() => {
          throw new UnauthorizedException();
        })
      );
  }

}
