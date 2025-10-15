/**
 * User Entity (Domain Layer)
 * - user.entity.ts
 */
export class UserEntity {
  id: string;
  email: string;
  name: string;
  picture?: string;
  googleId: string;

  constructor(data: Partial<UserEntity>) {
    Object.assign(this, data);
  }

  /**
   * Methods
   */
  get displayName(): string {
    return this.name || this.email.split('@')[0];
  }

  hasValidEmail(): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email);
  }
}