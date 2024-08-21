import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthService } from "../auth.service";

@Injectable()
export class AuthGuard implements CanActivate{
    constructor(private jwtService:JwtService,
        private authService:AuthService
    ){}
   async canActivate(context: ExecutionContext){
        let payload:string;
        let req= context.switchToHttp().getRequest()
        const authorization=await req.headers.authorization
        if(!authorization){
            console.log('erroring')
            throw new HttpException('you should register first',HttpStatus.UNAUTHORIZED)
        }
        const accessToken=authorization?.split(' ')[1]
        console.log(accessToken)
       
      
        try{
        const payload=this.authService.verifyToken(accessToken)
        const user=await this.authService.findById(payload['userId'])
        req.user=user
        console.log("user ",req.user)
         
        }
        catch(err){
            console.log(err)
            if(err.message==='jwt expired'){
          throw new HttpException('you should login again',HttpStatus.UNAUTHORIZED)
                
            }else{
                console.log(err)
            throw new HttpException(err,err.status||HttpStatus.BAD_GATEWAY)
        }
        
    }
    return true
    }

    

     
}
