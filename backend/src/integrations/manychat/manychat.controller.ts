import {
  Body,
  Controller,
  ForbiddenException,
  Headers,
  HttpCode,
  Logger,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ManyChatService } from './manychat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/role.enum';

@Controller('integrations/manychat')
export class ManyChatController {
  private readonly logger = new Logger(ManyChatController.name);
  private readonly secret: string | undefined;

  constructor(private readonly manychatService: ManyChatService) {
    this.secret = process.env.MANYCHAT_WEBHOOK_SECRET;
    if (!this.secret) {
      this.logger.warn(
        'MANYCHAT_WEBHOOK_SECRET is not set. Webhook will reject requests until configured.',
      );
    }
  }

  private validateSecret(headerSecret?: string, querySecret?: string) {
    if (!this.secret) {
      throw new ForbiddenException('Webhook secret not configured on server.');
    }
    const provided = (headerSecret || querySecret || '').toString().trim();
    if (!provided || provided !== this.secret) {
      throw new ForbiddenException('Invalid webhook secret.');
    }
  }

  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Headers('x-webhook-secret') headerSecret: string | undefined,
    @Query('secret') querySecret: string | undefined,
    @Body() payload: any,
  ) {
    // validate
    this.validateSecret(headerSecret, querySecret);

    this.logger.log('Validated ManyChat webhook request');
    this.logger.debug(`Payload keys: ${Object.keys(payload || {}).join(', ')}`);

    try {
      const result = await this.manychatService.handleManychatPayload(payload);
      return {
        status: 'ok',
        processed: true,
        result,
      };
    } catch (err) {
      this.logger.error('Error processing ManyChat payload', err as any);
      throw err;
    }
  }

  /**
   * Admin-only endpoint to trigger a test payload for ManyChat processing.
   * Protected by JWT + Roles (ADMIN_PLENO).
   *
   * Example use: the Admin UI calls this endpoint to "Test webhook" without
   * needing to configure external ManyChat yet.
   */
  @Post('webhook/test')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN_PLENO)
  @HttpCode(200)
  async handleWebhookTest(@Body() body: any) {
    const payload = body || {
      subscriber: { id: 'mc_test_local', phone: '+5511999999000', name: 'UI Test' },
      message: { text: 'SIM', attachments: [] },
      meta: { projectId: '', dayNumber: 1 }, // you can pass projectId in the body to target a real project
    };

    this.logger.log('Running ManyChat webhook test (admin trigger)');
    try {
      const result = await this.manychatService.handleManychatPayload(payload);
      return { status: 'ok', test: true, result };
    } catch (err) {
      this.logger.error('Error during ManyChat test', err as any);
      throw err;
    }
  }
}
