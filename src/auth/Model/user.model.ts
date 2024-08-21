import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import * as bcrypt from 'bcrypt'
import { Document } from "mongoose"
@Schema()
export class User extends Document {
    
    @Prop({required:true})
    firstname:string

    @Prop({required:true})
    lastname:string
    
    @Prop({required:true})
    password:string

    @Prop({required:true,unique:true})
    email:string

    @Prop()
    socketId?:string
     

}
export const userSchema=SchemaFactory.createForClass(User)
userSchema.pre('save',async function(next){
    if(this.isModified('password')){
    this.password=await bcrypt.hash(this.password,10)
    next()
    }
})