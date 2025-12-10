import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { ManychatConnection } from '@prisma/client';

@Injectable()
export class ManychatConnectionService {
  private readonly logger = new Logger(ManychatConnectionService.name);

  constructor(private prisma: PrismaService) {}

  async getStatus(projectId?: string): Promise<ManychatConnection | null> {
    return this.prisma.manychatConnection.findUnique({
      where: { provider_projectId: { provider: 'manychat', projectId: projectId ?? null } },
    }).catch(() => null);
  }

  async upsertConnection(data: {
    projectId?: string | null;
    accessToken?: string | null;
    refreshToken?: string | null;
    connected?: boolean;
    subscriberCount?: number;
  }) {
    const projectId = data.projectId ?? null;
    try {
      return this.prisma.manychatConnection.upsert({
        where: { provider_projectId: { provider: 'manychat', projectId } },
        create: {
          provider: 'manychat',
          projectId,
          connected: Boolean(data.connected),
          accessToken: data.accessToken ?? null,
          refreshToken: data.refreshToken ?? null,
          subscriberCount: data.subscriberCount ?? 0,
        },
        update: {
          connected: data.connected ?? undefined,
          accessToken: data.accessToken ?? undefined,
          refreshToken: data.refreshToken ?? undefined,
          subscriberCount: data.subscriberCount ?? undefined,
          lastSyncAt: new Date(),
        },
      });
    } catch (err) {
      this.logger.error('Error upserting manychat connection', err as any);
      throw new BadRequestException('Unable to upsert connection');
    }
  }

  async disconnect(projectId?: string) {
    const project = projectId ?? null;
    return this.prisma.manychatConnection.updateMany({
      where: { provider: 'manychat', projectId: project },
      data: { connected: false, accessToken: null, refreshToken: null },
    });
  }

  // Optional: increment subscriber count helper
  async setSubscriberCount(projectId: string | null, count: number) {
    return this.prisma.manychatConnection.update({
      where: { provider_projectId: { provider: 'manychat', projectId } },
      data: { subscriberCount: count, lastSyncAt: new Date() },
    });
  }
}
