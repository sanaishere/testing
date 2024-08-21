import { IsNotEmpty, IsString } from "class-validator";

export class SendChatDto{
    @IsNotEmpty()
    reciverId:string

    @IsNotEmpty()
    @IsString()
    message:string


}