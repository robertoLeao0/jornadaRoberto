import { Controller, Post, Body } from '@nestjs/common';
import { ManyChatService } from './manychat.service';

@Controller('integrations/manychat/webhook')
export class ManychatTestController {
  constructor(private readonly manychatService: ManyChatService) {}

  @Post('test')
  async testWebhook(@Body() payload: any) {
    const result = await this.manychatService.handleManychatPayload(payload);

    return {
      status: 'ok',
      mode: 'test',
      receivedPayload: payload,
      result,
    };
  }
}
