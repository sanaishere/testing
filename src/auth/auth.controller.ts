import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { SignUpDto } from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
constructor(private authService:AuthService){}

@Post('signUp')
@HttpCode(HttpStatus.CREATED)
@ApiBearerAuth()
async signUp(@Body() body:SignUpDto){
 return await this.authService.signUp(body)
   
}

@Post('login')
@HttpCode(HttpStatus.OK)
async login(@Body() body:LoginDto){
 return await this.authService.login(body)
   
}


}
