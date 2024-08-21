import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class LoginDto {
    @IsNotEmpty({message:'email should not be empty'})
    @IsEmail()
    email:string
    
    @IsNotEmpty({message:'enter password'})
    @IsString()
    password:string
    
    }