import { Prop,Schema, SchemaFactory } from "@nestjs/mongoose"
import mongoose, { Document } from "mongoose"
import { User } from "src/auth/Model/user.model"

@Schema()
export class Chat extends Document  {
    @Prop({type:Date,default:Date.now})
    date:Date

    @Prop({type:mongoose.Schema.Types.ObjectId,ref:'User'})
    sender:User

    @Prop()
    messageText?:string

    @Prop()
    messageFile?:string

    @Prop({required:true,type:mongoose.Schema.Types.ObjectId,ref:'User'})
    reciver:User

    @Prop({default:false})
    isSeen:boolean

}

export const chatSchema=SchemaFactory.createForClass(Chat)