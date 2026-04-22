import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || "defaultSecret",
    });
  }

  async validate(payload: { sub: string; username: string }) {
    // แค่ตรวจว่า token valid และเป็น admin
    if (payload.sub !== 'admin') throw new UnauthorizedException();
    return { username: payload.username };
  }
}