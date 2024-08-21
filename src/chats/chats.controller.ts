import { Body, Controller, Get, Param, Post,
     Request, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { AuthGuard } from 'src/auth/guard/auth.guard';
import { SendChatDto } from './dto/sendChat.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import {diskStorage} from 'multer'
import { extname } from 'path';
@Controller('chats')
export class ChatsController {
constructor(private chatService:ChatsService){}

@UseGuards(AuthGuard)
@Post('/sendChat')
async sendChat(@Body() body:SendChatDto,@Request() {user}) {
  return await this.chatService.sendChat(body,user)
}

@UseGuards(AuthGuard)
@UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './files', 
      filename: (req, file, callback) => {
        const name=file.originalname
        callback(null, name); // Define the filename
      },
    }),
  }))
@Post('/sendFile')
async sendFile(@Request() {user},@UploadedFile() file:Express.Multer.File,@Body() body:{reciverId:string} ) {
 return await this.chatService.sendFile(user,file,body.reciverId)
}

@UseGuards(AuthGuard)
@Get('getMyChats')
async getMyChats(@Request() {user}) {
return await this.chatService.getMyChats(user)
}


@Get('file/:filepath')
  async seeUploadedFile(@Param('filepath') file, @Res() res,@Request() {user}) {
     return res.sendFile(file, { root: './files' });
   }

@UseGuards(AuthGuard)
@Get('getMychatsWith/:userId')
async getMyChatsWithUser(@Request() {user},@Param('userId') reciverId:string) {
return await this.chatService.getMyChatsWithUser(user,reciverId)
}

@UseGuards(AuthGuard)
@Get('getUnseenMessages')
async getUnseenMessages(@Request() {user}) {
return await this.chatService.getUnseenMessages(user)
}

@UseGuards(AuthGuard)
@Get('getMyNotifs')
async getMyNotifications(@Request() {user}) {

}




}
