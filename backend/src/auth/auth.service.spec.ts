import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UnauthorizedException } from '@nestjs/common';
import { describe, beforeEach, it } from 'node:test';

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config = {
        ADMIN_USERNAME: 'admin',
        ADMIN_PASSWORD: 'password123',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should return token on valid login', async () => {
    const result = await service.login({
      username: 'admin',
      password: 'password123',
    });

    expect(result.access_token).toBe('mock-token');
  });

  it('should throw UnauthorizedException on wrong password', async () => {
    await expect(
      service.login({ username: 'admin', password: 'wrong' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('should throw UnauthorizedException on wrong username', async () => {
    await expect(
      service.login({ username: 'hacker', password: 'password123' }),
    ).rejects.toThrow(UnauthorizedException);
  });
});