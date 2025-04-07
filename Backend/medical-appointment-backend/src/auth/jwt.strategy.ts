import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: '4f8e5b6d9c7a12e3f4b89d5a6c7e8f9a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e', 
    });
  }

  async validate(payload: any) {
    console.log("JWT Payload:", payload);
    return {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
  }
}