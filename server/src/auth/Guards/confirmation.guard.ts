import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ConfirmationGuard implements CanActivate {

    constructor(private jwtService: JwtService){}

    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        
        const token = req.cookies?.accessToken; 

        if (!token) {
            throw new UnauthorizedException({ message: "Пользователь не авторизован (токен отсутствует в cookies)" });
        }

        try {
            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_KEY_ACCESS
            });
            
            req.user = user;
            console.log(req.user);
            if (!req.user.isActivated) {
                throw new HttpException('Почта не подтверждена', HttpStatus.FORBIDDEN);
            }
            
            return true;
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }
            throw new UnauthorizedException({ message: "Пользователь не авторизован или сессия устарела" });
        }
    }
}
