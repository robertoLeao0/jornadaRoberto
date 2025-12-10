import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ScheduledMessagesService {
  private readonly logger = new Logger(ScheduledMessagesService.name);

  constructor(private prisma: PrismaService) {}

  async list(projectId?: string) {
    return this.prisma.scheduledMessage.findMany({
      where: projectId ? { projectId } : {},
      orderBy: { scheduledAt: 'desc' },
    });
  }

  async get(id: string) {
    const item = await this.prisma.scheduledMessage.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Scheduled message not found');
    return item;
  }

  async create(data: {
    projectId?: string | null;
    title: string;
    body: string;
    mediaUrl?: string | null;
    targetType: string;
    targetValue?: string | null;
    scheduledAt: Date;
    repeatCron?: string | null;
    createdBy?: string | null;
  }) {
    return this.prisma.scheduledMessage.create({
      data: {
        projectId: data.projectId ?? null,
        title: data.title,
        body: data.body,
        mediaUrl: data.mediaUrl ?? null,
        targetType: data.targetType,
        targetValue: data.targetValue ?? null,
        scheduledAt: data.scheduledAt,
        repeatCron: data.repeatCron ?? null,
        createdBy: data.createdBy ?? null,
        status: 'scheduled',
      },
    });
  }

  async update(id: string, patch: Partial<any>) {
    return this.prisma.scheduledMessage.update({ where: { id }, data: patch });
  }

  async remove(id: string) {
    await this.prisma.scheduledMessage.delete({ where: { id } });
    return { deleted: true };
  }

  // Trigger immediate send (the actual send logic can call ManyChatService or queue a job)
  async sendNow(id: string) {
    const msg = await this.get(id);
    // mark as sending
    await this.update(id, { status: 'sending' });
    // Here you should call the ManyChat client / worker to perform the send
    // We'll just record a simple lastResult as placeholder
    try {
      // TODO: integrate with ManyChatService to actually send
      const result = { info: 'simulated send', sentAt: new Date().toISOString() };
      await this.update(id, { status: 'sent', lastResult: result });
      return { ok: true, result };
    } catch (err) {
      await this.update(id, { status: 'failed', lastResult: { error: (err as any).message } });
      throw err;
    }
  }
}
