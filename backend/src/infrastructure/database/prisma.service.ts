import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

/**
 * PrismaService
 *  manage db connection using Prisma ORM
 * Implementa:
 * - OnModuleInit: executed when the module is initialized
 * - OnModuleDestroy: executed when the module is destroyed
 */

console.log('PrismaClient imported:', typeof PrismaClient);

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: ['query', 'info', 'warn', 'error'], // Prisma logs
    });
  }

  /**
   * Connects to PostgreSQL when the module is initialized
   */
  async onModuleInit() {
    try {
      await this.$connect();
      this.logger.log('✅ Prisma connected to PostgreSQL');
    } catch (error) {
      this.logger.error('❌ Failed to connect to PostgreSQL', error);
      throw error;
    }
  }

  /**
   * disconnects the connection when the module is destroyed
   */
  async onModuleDestroy() {
    await this.$disconnect();
    this.logger.log('❌ Prisma disconnected from PostgreSQL');
  }

  /**
   * cleans the database by deleting all records from all tables
   * ⚠️ DO NOT use in production
   */
  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Cannot clean database in production');
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key[0] !== '$',
    );

    return Promise.all(
      models.map((modelKey) => this[modelKey].deleteMany()),
    );
  }
}