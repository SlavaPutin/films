import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";



@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request: Request) => {
                  if (!request || !request.cookies) {
                        return null;
                  }
                  return request?.cookies['accessToken']; 
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET_KEY_ACCESS!,
        });
    }

    async validate(payload: any) {
        return { id: payload.id, email: payload.email, roles: payload.roles };
    }
}