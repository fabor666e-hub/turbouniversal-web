import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from '../config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GuardiaAdmin } from './guardia-admin';

@Module({
  imports: [JwtModule.registerAsync({ useFactory: () => ({ secret: config().jwtSecreto }) })],
  controllers: [AuthController],
  providers: [AuthService, GuardiaAdmin],
  exports: [GuardiaAdmin, JwtModule],
})
export class AuthModule {}
