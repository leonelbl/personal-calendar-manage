import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './infrastructure/database/database.module';
import { AuthModule } from './presentation/controllers/auth/auth.module';
import { BookingsModule } from './presentation/controllers/bookings/bookings.module';

@Module({
  imports: [
    DatabaseModule,
    AuthModule,
    BookingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
