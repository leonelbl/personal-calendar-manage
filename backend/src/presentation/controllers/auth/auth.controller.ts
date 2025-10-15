import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import type { Request, Response } from 'express';
import { GoogleAuthGuard } from '../../guards/google-auth.guard';
import { GoogleLoginUseCase } from '../../../core/use-cases/auth/google-login.use-case';
import { GoogleUserDto } from '../../dto/auth.dto';
import { envConfig } from '../../../infrastructure/config/env.config';
import { JwtAuthGuard } from 'src/presentation/guards/jwt-auth.guard';

/**
 * AuthController
 * 
 * Controllre for authentication routes.
 * 
 * Routes:
 * - GET /auth/google → initiate Google OAuth flow
 * - GET /auth/google/callback → Callback for Google OAuth
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly googleLoginUseCase: GoogleLoginUseCase) {}

  /**
   * GET /auth/google
   * Initiates Google OAuth2 authentication.
   * Guard redirects to Google for authentication.
   */
  @Get('google')
  @UseGuards(GoogleAuthGuard)
  async googleAuth() {
    // This method is not executed
    // GoogleAuthGuard redirects to Google before reaching here
  }

  /**
   * GET /auth/google/callback
   * Callback for Google OAuth2 authentication.
   * 
   * Flow:
   * 1. GoogleAuthGuard validate google token
   * 2. GoogleStrategy extract user info
   * 3. Inject user info into req.user
   * 4. GoogleLoginUseCase processes login/signup
   * 5. Redirect to frontend with JWT
   */
  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleAuthRedirect(@Req() req: Request, @Res() res: Response) {
    try {
      // req.user comes from GoogleStrategy.validate()
      const googleUser = req.user as GoogleUserDto;

      // Execute login use case
      const authResponse = await this.googleLoginUseCase.execute(googleUser);

      // Get frontend URL
      const config = envConfig();
      const frontendUrl = config.frontend.url;

      // Redirect to frontend with token in URL
      // In production, this should go in an httpOnly cookie
      return res.redirect(
        `${frontendUrl}/auth/callback?token=${authResponse.accessToken}`,
      );
    } catch (error) {
      console.error('Error in Google callback:', error);
      
      // Redirect to frontend error page
      const config = envConfig();
      return res.redirect(`${config.frontend.url}/auth/error`);
    }
  }

  /**
   * GET /auth/me
   * 
   * get authenticated user info
   * Requires valid JWT in Authorization header
   */
  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMe(@Req() req: Request) {
    // req.user comes from JwtStrategy.validate()
    return {
      user: req.user,
    };
  }
}