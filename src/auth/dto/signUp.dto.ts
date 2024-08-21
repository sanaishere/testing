import { IsEmail, IsNotEmpty, IsString } from "class-validator"

export class SignUpDto{
    @IsNotEmpty({message:'enter firstname'})
    @IsString()
    firstname:string
    
    @IsNotEmpty({message:'enter lastname'})
    @IsString()
    lastname:string
  
    @IsNotEmpty({message:'email should not be empty'})
    @IsEmail()
    email:string
    
   
    @IsNotEmpty({message:'enter password'})
    @IsString()
    password:string
    
    
    }