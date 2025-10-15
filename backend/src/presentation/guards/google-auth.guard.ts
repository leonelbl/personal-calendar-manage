import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * GoogleAuthGuard
 * 
 * Guard that initiates Google OAuth2 authentication.
 * 
 * Use:
 * @UseGuards(GoogleAuthGuard)
 * @Get('google')
 * googleAuth() {
 *   // guards redirect to Google for authentication
 * }
 */
@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const activate = (await super.canActivate(context)) as boolean;
    // const request = context.switchToHttp().getRequest();
    // await super.logIn(request);
    return activate;
  }
}