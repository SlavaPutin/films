import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Observable } from "rxjs";
import { ROLES_KEY } from "../roles-auth.decorator";

@Injectable()
export class RoleGuard implements CanActivate {

    constructor(
        private jwtService: JwtService,
        private reflector: Reflector
    ){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        try {
            const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
                context.getHandler(), 
                context.getClass(),
            ]);
            
            if (!requiredRoles) {
                return true; 
            }
            const req = context.switchToHttp().getRequest();
            
            const token = req.cookies?.['accessToken'];
            if (!token) {
                throw new UnauthorizedException({ message: "Пользователь не авторизован" });
            }
            const user = this.jwtService.verify(token, {
                secret: process.env.SECRET_KEY_ACCESS
            });
            req.user = user;
            const hasRole = user.role.some(role => requiredRoles.includes(role))
            console.log(hasRole, user.role, requiredRoles)
            if (!hasRole) {
                throw new HttpException("У вас нет доступа", HttpStatus.FORBIDDEN);
            }

            return true;
        } catch (e) {
            if (e instanceof HttpException) {
                throw e;
            }
            throw new UnauthorizedException({ message: "Пользователь не авторизован" });
        }
    }
}
