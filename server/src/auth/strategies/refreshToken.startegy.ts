import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";

interface RequestWithCookies extends Request {
    cookies: {
        [key: string]: string;
    };
}

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: RequestWithCookies) => {
        return req?.cookies?.['refreshToken'] || null;
      },
      secretOrKey: process.env.SECRET_KEY_REFRESH!,
      passReqToCallback: true,
    });
  }

  validate(req: RequestWithCookies, payload: any) {
    const refreshToken = req.cookies?.['refreshToken'];
    return { ...payload, refreshToken };
  }
}
