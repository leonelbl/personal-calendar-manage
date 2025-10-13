import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * JwtAuthGuard
 * 
 * Guard that protects routes using the JWT strategy.
 * 
 * Use:
 * @UseGuards(JwtAuthGuard)
 * @Get('protected')
 * protectedRoute(@Request() req) {
 *   console.log(req.user); // Authenticated user
 * }
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // Calls the JWT strategy
    return super.canActivate(context);
  }
}