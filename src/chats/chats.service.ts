import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Chat } from './Model/chat.model';
import { Document, Model } from 'mongoose';
import { SendChatDto } from './dto/sendChat.dto';
import { User } from 'src/auth/Model/user.model';
import { WebsocketGateway } from 'src/websocket/webSocket.gateAway';
import { AuthService } from 'src/auth/auth.service';

require('dotenv').config()
@Injectable()
export class ChatsService {
    constructor(@InjectModel(Chat.name) private chatModel:Model<Chat>,
      private webSocketGateAway:WebsocketGateway,
      private authService:AuthService){}
    
    async sendChat(body:SendChatDto,user:User){
      let newChat=await this.chatModel.create({
        sender:user._id,
        reciver:body.reciverId,
        messageText:body.message

      })
      console.log(newChat)
      let reciver=await this.authService.findById(body.reciverId)
      this.webSocketGateAway.sendMessage(newChat,reciver)
      return newChat

    }

    async sendFile(user:User,file:Express.Multer.File,reciverId:string) {
        let fileUrl=`${process.env.URL}/chats/file/${file.filename}`
        let newChat=await this.chatModel.create({
            sender:user._id,
            reciver:reciverId,
            messageFile:fileUrl
    
          })
          let reciver=await this.authService.findById(reciverId)
          this.webSocketGateAway.sendMessage(newChat,reciver)
          return newChat
    }


    async getMyChats(user:User) {
        let chats =await this.chatModel.aggregate( [
            {
                $match:{
                    $or:[
                        {sender:user._id},
                        {reciver:user._id},
                    ]
                }
            },
            {
                $group: {
                    _id: {
                        $cond: [
                            { $eq: ["$sender", user._id] },
                            "$reciver",
                            "$sender"
                        ]
                    },
                    messages: { $push: "$$ROOT" },
                    
                }
            },
            {
              $sort: { "messages.date" :-1} 
            }
          ]
        ) 
        
        
    
        const sendingData =await this.sendingData(chats)
    await this.webSocketGateAway.sendMessages(sendingData,user)
    return chats
    }

    async getMyChatsWithUser(user:User,anotherUserId:string) {
        const chats=await this.getChatsBetweenUsers(user,anotherUserId)
        let sendingData=await this.sendingData(chats)
        await this.webSocketGateAway.sendMessages(sendingData,user)
        return chats
    }

    async getUnseenMessages(user:User) {
       const chats=await this.chatModel.find({isSeen:false,
        reciver:user._id})
        await this.webSocketGateAway.sendMessages(await this.sendingData(chats),user)
    }

   

    async findById(id:string){
        const chat=await this.chatModel.findById(id)
        if(!chat) {
            throw new HttpException('chat with this id is not found',HttpStatus.NOT_FOUND)
        }
        return chat
    }

    async sendingData(chats:any) {
       return await Promise.all(
            chats.map(async (chat) => {
              const chatAsDoc = await this.chatModel.findById(chat._id);
              if (chatAsDoc) {
                chatAsDoc.isSeen = true;
                await chatAsDoc.save();
              }
              return {
                message: chat.messageText ? chat.messageText : chat.messageFile,
                date: chat.date
              };
            })
          );
    }

    async getChatsBetweenUsers(user:User,anotherUserId:string){
      return  await this.chatModel.find
        ({$or:[{sender:user._id,reciver:anotherUserId},
            {sender:anotherUserId,reciver:user._id}]})
            .sort({'date':-1})
    }

     

}
