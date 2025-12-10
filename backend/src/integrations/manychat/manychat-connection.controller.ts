import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { ManychatConnectionService } from './manychat-connection.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('api/integrations/manychat')
export class ManychatConnectionController {
  private readonly logger = new Logger(ManychatConnectionController.name);

  constructor(private svc: ManychatConnectionService) {}

  // Public: check status for a given project (optional auth if you want; here protected)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_PLENO, UserRole.GESTOR_MUNICIPIO)
  @Get('status')
  async status(@Query('projectId') projectId?: string) {
    return this.svc.getStatus(projectId);
  }

  // Admin-only: connect (save tokens)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_PLENO)
  @Post('connect')
  async connect(@Body() body: { projectId?: string; accessToken: string; refreshToken?: string }) {
    const { accessToken } = body;
    if (!accessToken) throw new BadRequestException('accessToken required');
    const res = await this.svc.upsertConnection({
      projectId: body.projectId ?? null,
      accessToken: body.accessToken,
      refreshToken: body.refreshToken ?? null,
      connected: true,
    });
    this.logger.log('ManyChat connected for project ' + (body.projectId ?? 'global'));
    return res;
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_PLENO)
  @Post('disconnect')
  async disconnect(@Body() body: { projectId?: string }) {
    return this.svc.disconnect(body.projectId);
  }
}
