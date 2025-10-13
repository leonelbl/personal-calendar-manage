import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { GoogleLoginUseCase } from '../../../core/use-cases/auth/google-login.use-case';
import { GoogleStrategy } from '../../strategies/google.strategy';
import { JwtStrategy } from '../../strategies/jwt.strategy';
import { envConfig } from '../../../infrastructure/config/env.config';

@Module({
  imports: [
    // Passport for strategy management
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // JWT to validate tokens
    JwtModule.register({
      secret: envConfig().jwt.secret,
      signOptions: {
        expiresIn: envConfig().jwt.expiresIn as any,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    // Use cases
    GoogleLoginUseCase,
    // Passport strategies
    GoogleStrategy,
    JwtStrategy,
  ],
  exports: [
    // Export for use in other modules
    JwtStrategy,
    GoogleLoginUseCase,
  ],
})
export class AuthModule {}