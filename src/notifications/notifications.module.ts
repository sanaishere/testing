import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { notificationSchema } from './Model/notification.model';
import { AuthModule } from 'src/auth/auth.module';
import { Notification } from './Model/notification.model';
@Module({
  imports:[MongooseModule.forFeature([{name:Notification.name,schema:notificationSchema}]),
  AuthModule],
  providers: [NotificationsService],
  controllers: [NotificationsController],
  exports:[NotificationsService]
})
export class NotificationsModule {}
