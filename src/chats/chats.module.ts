import { Module } from '@nestjs/common';
import { ChatsController } from './chats.controller';
import { ChatsService } from './chats.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, chatSchema } from './Model/chat.model';
import { AuthModule } from 'src/auth/auth.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { WebsocketModule } from 'src/websocket/websocket.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Chat.name,schema:chatSchema}]),
    MulterModule.register({dest:'./files'}),
   AuthModule,NotificationsModule,WebsocketModule],
  controllers: [ChatsController],
  providers: [ChatsService],
  exports:[ChatsModule,MongooseModule]
})
export class ChatsModule {}
