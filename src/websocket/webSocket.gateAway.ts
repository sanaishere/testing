
import { InjectModel } from "@nestjs/mongoose";
import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer, WsException } from "@nestjs/websockets";
import { Model } from "mongoose";
import { Server, Socket } from "socket.io";
import { AuthService } from "src/auth/auth.service";
import { User } from "src/auth/Model/user.model";
import { ChatsService } from "src/chats/chats.service";
import { Chat } from "src/chats/Model/chat.model";
import { NotificationsService } from "src/notifications/notifications.service";


@WebSocketGateway({
    cors: {
        origin: '*',
      },
    }
)

export class WebsocketGateway implements OnGatewayConnection {
    constructor(private authService:AuthService,
        private notificationService:NotificationsService,
        @InjectModel(Chat.name) private chatModel:Model<Chat>
   
    ) {}
    
   @WebSocketServer() server: Server;
    async  handleConnection(client: Socket) {
      let token=client.handshake.headers.authorization
      try{
      const payload=await this.authService.verifyToken(token)
      await this.authService.setSocketId(payload['userId'],client.id)
      //get notifs after connection again
      await this.getNotifs(client.id)
      }catch(err){
       console.log(err)
       client.emit('error',err)
      
      }
    
    }

   async handleDisconnect(socket: Socket) {
    try{
    const user:User = await this.authService.findBySocketId(socket.id);
    if (user) {
       await this.authService.setSocketId(user.id,null)
    }
    }
  catch(err){
    console.log(err)
    socket.emit('error',err)
  }
  }
    //send message realtime and if user is online update chat to be seen!
   @SubscribeMessage('send message')
   async sendMessage(@MessageBody() data:Chat,@ConnectedSocket() socket:User) {
    let sendingData={message:data.messageText?data.messageText:data.messageFile,
        date:data.date
    }
   console.log("socket",socket.socketId)
   if(socket.socketId===null){
    
    await this.notificationService.create(data)
   }
   else{
   data.isSeen=true
   await data.save()
   this.server.to(socket.socketId).emit('send message',sendingData)
   }
  }

   //sending messages realtime
  async sendMessages(@MessageBody() data:any,@ConnectedSocket() socket:User) {
    console.log(data)
    try{
   this.server.to(socket.socketId).emit('send message',data)
   }catch(err) {
    this.server.to(socket.socketId).emit('error',err)
   }
  }

  
//get notification for unSeen messages
   async getNotifs(socketId:string) {
     let user=await this.authService.findBySocketId(socketId)
      const unSeenChats=await this.chatModel.find({isSeen:false,
        reciver:user._id})
      let chatIds=unSeenChats.map((u)=>u._id.toString())
        console.log(chatIds)
        let notifs=await this.notificationService.getUserNotifs(socketId)
        for( let notif of notifs) {
           if( chatIds.includes(notif.forChat._id.toString())){
            console.log("notif")
            this.server.to(socketId).emit('send notifs',notif.notifText)

           }
        }
    }
}