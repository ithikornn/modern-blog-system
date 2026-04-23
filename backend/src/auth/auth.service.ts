import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { LoginDto } from "./dto/login.dto";
import { InjectRepository } from "@nestjs/typeorm";
import bcrypt from "node_modules/bcryptjs";
import { Admin, Repository } from "typeorm";

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}
 
  async login(dto: LoginDto) {
    const username = this.config.get<string>('ADMIN_USERNAME');
    const passwordHash = this.config.get<string>('ADMIN_PASSWORD_HASH');
 
    if (!passwordHash) {
      // ป้องกันการ start ระบบโดยไม่ตั้งค่า hash
      throw new InternalServerErrorException(
        'ADMIN_PASSWORD_HASH ยังไม่ได้ตั้งค่าใน environment',
      );
    }
 
    // timing-safe: ตรวจ username ก่อน แล้วค่อย bcrypt.compare
    // ถ้า username ไม่ตรงก็ยังรัน bcrypt.compare กับ dummy เพื่อให้ response time เท่ากัน
    const usernameMatch = dto.username === username;
    const passwordMatch = await bcrypt.compare(dto.password, passwordHash);
 
    if (!usernameMatch || !passwordMatch) {
      throw new UnauthorizedException('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
    }
 
    return {
      access_token: this.jwtService.sign({ sub: 'admin', username }),
    };
  }
}