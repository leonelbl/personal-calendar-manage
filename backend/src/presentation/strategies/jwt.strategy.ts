import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { envConfig } from '../../infrastructure/config/env.config';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { JwtPayloadDto } from '../dto/auth.dto';

/**
 * JwtStrategy
 * Strategy for validating JWTs in protected requests.
 * 
 * Flow:
 * 1. Client sends request with header: Authorization: Bearer <token>
 * 2. ExtractJwt extracts the token
 * 3. Passport verifies the signature with JWT_SECRET
 * 4. If valid, executes validate() with the payload
 * 5. validate() returns the user (injected into req.user)
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly prisma: PrismaService) {
    const config = envConfig();
    
    super({
      // Where to extract the JWT from
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      
      // false, if token expired, it will be rejected
      ignoreExpiration: false,
      
      // secret to verify the token's signature
      secretOrKey: config.jwt.secret,
    });
  }

  /**
   * Validates the JWT payload and returns the user.
   *
   * Runs automatically when the token is valid.
   * The returned value is injected into req.user.
   */
  async validate(payload: JwtPayloadDto) {
    // Find user in the database      
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        id: true,
        email: true,
        name: true,
        picture: true,
        googleId: true,
      },
    });

    // if user not found, throw exception
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Return user (injected into req.user)
    return user;
  }
}