import { Module, Global } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';

/**
 * Google service module
 *
 * @Global() to be available throughout the app
 */
@Global()
@Module({
  providers: [GoogleCalendarService],
  exports: [GoogleCalendarService],
})
export class GoogleModule {}