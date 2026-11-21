import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PanelController } from './panel.controller';

@Module({ imports: [AuthModule], controllers: [PanelController] })
export class PanelModule {}
