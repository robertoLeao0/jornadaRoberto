// src/integrations/settings/integrations-settings.module.ts
import { Module } from '@nestjs/common';
import { IntegrationsSettingsController } from './integrations-settings.controller';
import { IntegrationsSettingsService } from './integrations-settings.service';
import { PrismaService } from '../../database/prisma.service';

@Module({
  controllers: [IntegrationsSettingsController],
  providers: [IntegrationsSettingsService, PrismaService],
  exports: [IntegrationsSettingsService],
})
export class IntegrationsSettingsModule {}
