// src/integrations/settings/integrations-settings.controller.ts
import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { IntegrationsSettingsService } from './integrations-settings.service';
import { UpsertIntegrationSettingDto } from './dto/upsert-integration-setting.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('integrations/settings')
@UseGuards(JwtAuthGuard, RolesGuard)
export class IntegrationsSettingsController {
  constructor(private readonly service: IntegrationsSettingsService) {}

  // GET /api/integrations/settings/:name?projectId=...
  @Get(':name')
  @Roles(UserRole.ADMIN_PLENO, UserRole.GESTOR_MUNICIPIO)
  async getByName(
    @Param('name') name: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.service.findByNameAndProject(name, projectId);
  }

  // POST /api/integrations/settings/upsert
  @Post('upsert')
  @Roles(UserRole.ADMIN_PLENO, UserRole.GESTOR_MUNICIPIO)
  async upsert(@Body() dto: UpsertIntegrationSettingDto) {
    return this.service.upsert(dto);
  }
}
