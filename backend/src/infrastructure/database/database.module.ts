import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

/**
 * DatabaseModule
 * 
 */
@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // allow other modules to use PrismaService
})
export class DatabaseModule {}