/**
 * Data transfer objects (DTOs) for authentication
 * - auth.dto.ts
 * - Defines the structure of data for Google OAuth user info,
 *   authentication responses, and JWT payloads.
 */

/**
 * User data provided by Google OAuth
 */
export class GoogleUserDto {
  googleId: string;
  email: string;
  name: string;
  picture?: string;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Successful authentication response
 */
export class AuthResponseDto {
  accessToken: string; // JWT for our app
  user: {
    id: string;
    email: string;
    name: string;
    picture?: string;
  };
}

/**
 * Payload that goes inside the JWT
 */
export class JwtPayloadDto {
  sub: string;      // User ID
  email: string;
  iat?: number;     // Issued At (timestamp)
  exp?: number;     // Expiration (timestamp)
}