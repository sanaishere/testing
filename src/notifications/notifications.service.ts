import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './Model/notification.model';
import { Model } from 'mongoose';
import { User } from 'src/auth/Model/user.model';
import { AuthService } from 'src/auth/auth.service';
import { Chat } from 'src/chats/Model/chat.model';

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel:Model<Notification>,
     private authService:AuthService){}
    //create notification for each unSeen chat
    async create(data:Chat) {
      console.log(data.sender._id)
      const sender=await this.authService.findById(data.sender._id as string)
      let notifText=`you got message from ${sender.firstname}  ${sender.lastname} `
     await this.notificationModel.create({notifText,reciver:data.reciver._id,forChat:data._id})
    }
 
    //get users notifications
    async getUserNotifs(socketId:string) {
       const user=await this.authService.findBySocketId(socketId)
       return await this.notificationModel.find({reciver:user._id})
    }
}
