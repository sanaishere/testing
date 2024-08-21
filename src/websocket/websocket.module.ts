import { forwardRef, Module } from '@nestjs/common';
import { WebsocketGateway } from './webSocket.gateAway';
import { AuthModule } from 'src/auth/auth.module';
import { ChatsModule } from 'src/chats/chats.module';
import { NotificationsModule } from 'src/notifications/notifications.module';

@Module({
    imports:[AuthModule,forwardRef(()=>ChatsModule),NotificationsModule],
    providers:[WebsocketGateway],
    exports:[WebsocketGateway]
})
export class WebsocketModule {
    
}
