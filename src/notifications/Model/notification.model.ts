import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { User } from "src/auth/Model/user.model"
import { Chat } from "src/chats/Model/chat.model"

@Schema()
export class Notification extends Document {
    @Prop({type:Date,default:Date.now})
    date:Date

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    reciver:User

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'Chat'})
    forChat:Chat

    @Prop({required:true})
    notifText:string



}

export const notificationSchema=SchemaFactory.createForClass(Notification)