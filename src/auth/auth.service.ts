import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './Model/user.model';
import { Model, ObjectId } from 'mongoose';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt'
import { SignUpDto } from './dto/signUp.dto';
import { JwtService } from '@nestjs/jwt';

require('dotenv').config()
@Injectable()
export class AuthService {
   constructor( @InjectModel(User.name) private userModel:Model<User>,
   private jwtService:JwtService ){}

   async signUp(signUpInput:SignUpDto) {
    const userExists=await this.userModel.findOne({email:signUpInput.email})
    if(userExists ){
        throw new HttpException('patient is already existed',HttpStatus.NOT_FOUND)
    }
    let newUser=await this.userModel.create({...signUpInput})
    console.log(newUser.id,newUser._id)
    newUser=await newUser.save()
    return {user:newUser,token:this.createToken(newUser._id)}
    
}


   async login(loginInput:LoginDto){
    let user=await this.userModel.findOne({email:loginInput.email})
    if(!user){
        throw new HttpException('user is not existed with this email',HttpStatus.NOT_FOUND)
    }
    if(! await bcrypt.compare(loginInput.password,user.password)) {
        throw new HttpException('wrong information',HttpStatus.NOT_FOUND)
    }
    return {user,token:this.createToken(user.id)}
}

   async findById(id:string){
    console.log("userId",id)
    const user=await this.userModel.findById(id)
    if(!user){
        throw new HttpException(`user with id ${id} is not existed`,HttpStatus.NOT_FOUND)
    }
    return user
    }

    async setSocketId(userId:string,socketId:any) {
        const user=await this.findById(userId)
        user.socketId=socketId
        await user.save()
    }

    async findBySocketId(socketId:string) {
        try{
          let user=await this.userModel.findOne({socketId:socketId})
           if(!user){
            throw new HttpException('client is disconnected',HttpStatus.BAD_REQUEST)
           }
           return user
             }catch(err){
                 throw new HttpException(err,HttpStatus.BAD_REQUEST)
             }
      }


   createToken(userId){
    let payload={userId}
    return this.jwtService.sign(payload)
   }

   verifyToken(token:string){
    console.log("token",token)
    try{
    return this.jwtService.verify(token)
    }catch(err){
        throw new HttpException(err,err.status||HttpStatus.INTERNAL_SERVER_ERROR)
    }
 }



}
