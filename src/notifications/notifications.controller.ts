import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notificationService:NotificationsService){}
  @UseGuards(AuthGuard)
  @Get('getMyNotifs')
  async getMyNotifications(@Request() {user}) {
   return await this.notificationService.getUserNotifs(user)
  }
}
