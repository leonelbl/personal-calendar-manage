import { Injectable, Logger } from '@nestjs/common';
import { google, calendar_v3 } from 'googleapis';

/**
 * Google Calendar API service
 * 
 * Verify if there are events in the user's calendar
 * that conflict with a new booking
 */
@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);

  /**
   * Check for conflicts in Google Calendar
   *
   * @param accessToken - Google OAuth access token
   * @param startTime - Booking start time
   * @param endTime - Booking end time
   * @returns true if there are conflicts, false if not
   */
  async checkConflicts(
    accessToken: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ hasConflict: boolean; events?: any[] }> {
    try {
      // 1. Configure OAuth2 client
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      // 2. Create Calendar API client
      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      // 3. Search for events in the time range
      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startTime.toISOString(),
        timeMax: endTime.toISOString(),
        singleEvents: true, // Expand recurring events
        orderBy: 'startTime',
      });

      const events = response.data.items || [];

      // 4. If there are events, there is a conflict
      if (events.length > 0) {
        this.logger.warn(
          `Found ${events.length} conflicting events in Google Calendar`,
        );

        // Log conflicting events (useful for debugging)
        events.forEach((event) => {
          this.logger.debug(
            `Conflicting event: ${event.summary} (${event.start?.dateTime} - ${event.end?.dateTime})`,
          );
        });

        return {
          hasConflict: true,
          events: events.map((e) => ({
            summary: e.summary,
            start: e.start?.dateTime || e.start?.date,
            end: e.end?.dateTime || e.end?.date,
          })),
        };
      }

      return { hasConflict: false };
    } catch (error: any) {
      // Error handling
      if (error.code === 401) {
        this.logger.error('Google Calendar access token expired or invalid');
        throw new Error('Google Calendar token expired');
      }

      if (error.code === 403) {
        this.logger.error('No permission to access Google Calendar');
        throw new Error('No calendar permission');
      }

      this.logger.error('Error checking Google Calendar conflicts:', error);

      // In case of error with Google Calendar, DO NOT block creation
      // Just log and continue
      return { hasConflict: false };
    }
  }

  /**
   * Get events from the calendar within a date range
   * (Useful for displaying in the frontend)
   */
  async getEvents(
    accessToken: string,
    startDate: Date,
    endDate: Date,
  ): Promise<calendar_v3.Schema$Event[]> {
    try {
      const oauth2Client = new google.auth.OAuth2();
      oauth2Client.setCredentials({
        access_token: accessToken,
      });

      const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

      const response = await calendar.events.list({
        calendarId: 'primary',
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      this.logger.error('Error fetching Google Calendar events:', error);
      return [];
    }
  }
}