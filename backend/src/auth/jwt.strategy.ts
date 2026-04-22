import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, ExtractJwt } from "passport-jwt";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    const secret = config.get<string>('JWT_SECRET');
    if (!secret) {
      throw new Error('JWT_SECRET ยังไม่ได้ตั้งค่าใน environment — ระบบจะไม่ start');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
      ignoreExpiration: false, // ชัดเจนว่าบังคับตรวจ expiry
    });
  }
 
  async validate(payload: { sub: string; username: string }) {
    if (payload.sub !== 'admin') throw new UnauthorizedException();
    return { username: payload.username };
  }
}
 