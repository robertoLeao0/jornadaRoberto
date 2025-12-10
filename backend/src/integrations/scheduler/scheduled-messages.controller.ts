import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ScheduledMessagesService } from './scheduled-messages.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('api/integrations/scheduled-messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ScheduledMessagesController {
  constructor(private svc: ScheduledMessagesService) {}

  @Get()
  @Roles(UserRole.ADMIN_PLENO, UserRole.GESTOR_MUNICIPIO)
  async list(@Query('projectId') projectId?: string) {
    return this.svc.list(projectId);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN_PLENO, UserRole.GESTOR_MUNICIPIO)
  async get(@Param('id') id: string) {
    return this.svc.get(id);
  }

  @Post()
  @Roles(UserRole.ADMIN_PLENO)
  async create(@Body() body: any) {
    // body must include: title, body, scheduledAt, targetType, optional projectId/mediaUrl
    return this.svc.create({
      projectId: body.projectId ?? null,
      title: body.title,
      body: body.body,
      mediaUrl: body.mediaUrl ?? null,
      targetType: body.targetType ?? 'project',
      targetValue: body.targetValue ?? null,
      scheduledAt: new Date(body.scheduledAt),
      repeatCron: body.repeatCron ?? null,
      createdBy: body.createdBy ?? null,
    });
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN_PLENO)
  async update(@Param('id') id: string, @Body() body: any) {
    return this.svc.update(id, body);
  }

  @Post(':id/send-now')
  @Roles(UserRole.ADMIN_PLENO)
  async sendNow(@Param('id') id: string) {
    return this.svc.sendNow(id);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN_PLENO)
  async remove(@Param('id') id: string) {
    return this.svc.remove(id);
  }
}
