// src/integrations/settings/dto/upsert-integration-setting.dto.ts
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpsertIntegrationSettingDto {
  @IsString()
  name: string; // ex: "manychat"

  @IsOptional()
  @IsString()
  projectId?: string | null;

  @IsBoolean()
  enabled: boolean;

  @IsOptional()
  @IsString()
  webhookSecret?: string | null;

  @IsOptional()
  configJson?: any;
}
