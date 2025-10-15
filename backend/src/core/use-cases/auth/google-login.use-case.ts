import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../infrastructure/database/prisma.service';
import { GoogleUserDto, AuthResponseDto, JwtPayloadDto } from '../../../presentation/dto/auth.dto';

/**
 * GoogleLoginUseCase
 * 
 */
@Injectable()
export class GoogleLoginUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async execute(googleUser: GoogleUserDto): Promise<AuthResponseDto> {
    // 1. search for existing user by googleId
    let user = await this.prisma.user.findUnique({
      where: { googleId: googleUser.googleId },
    });

    // 2. If not exists, create new user
    if (!user) {
      user = await this.prisma.user.create({
        data: {
          googleId: googleUser.googleId,
          email: googleUser.email,
          name: googleUser.name,
          picture: googleUser.picture,
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken,
          tokenExpiry: new Date(Date.now() + 3600 * 1000), // 1 hour from now
        },
      });
    } else {
      // 3. If exists, update Google tokens
      user = await this.prisma.user.update({
        where: { id: user.id },
        data: {
          accessToken: googleUser.accessToken,
          refreshToken: googleUser.refreshToken || user.refreshToken,
          tokenExpiry: new Date(Date.now() + 3600 * 1000),
          // Update other info in case changed
          name: googleUser.name,
          picture: googleUser.picture,
        },
      });
    }

    // 4. create JWT payload
    const payload: JwtPayloadDto = {
      sub: user.id,
      email: user.email,
    };

    // 5. Generate JWT for our app
    const accessToken = this.jwtService.sign(payload);

    // 6. Return response
    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name || '',
        picture: user.picture ?? undefined,
      },
    };
  }
}