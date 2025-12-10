// src/integrations/settings/integrations-settings.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { UpsertIntegrationSettingDto } from './dto/upsert-integration-setting.dto';

@Injectable()
export class IntegrationsSettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsert(dto: UpsertIntegrationSettingDto) {
    const { name, projectId } = dto;
    // Compound unique key name_projectId (verifique o schema.prisma)
    const where = { name_projectId: { name, projectId: projectId ?? null } };

    // Try upsert (depends on Prisma schema unique name_projectId)
    try {
      const existing = await this.prisma.integrationSetting.findUnique({
        where,
      });

      if (existing) {
        const updated = await this.prisma.integrationSetting.update({
          where,
          data: {
            enabled: dto.enabled,
            webhookSecret: dto.webhookSecret ?? existing.webhookSecret,
            configJson: dto.configJson ?? existing.configJson,
          },
        });
        return updated;
      }

      const created = await this.prisma.integrationSetting.create({
        data: {
          name,
          projectId: projectId ?? null,
          enabled: dto.enabled,
          webhookSecret: dto.webhookSecret ?? null,
          configJson: dto.configJson ?? {},
        },
      });

      return created;
    } catch (err) {
      throw new BadRequestException('Erro ao salvar configuração: ' + (err as any).message);
    }
  }

  async findByNameAndProject(name: string, projectId?: string | null) {
    return this.prisma.integrationSetting.findFirst({
      where: { name, ...(projectId ? { projectId } : { projectId: null }) },
    });
  }
}
