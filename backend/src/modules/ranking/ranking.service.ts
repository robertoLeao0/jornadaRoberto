import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class RankingService {
  constructor(private prisma: PrismaService) {}

  async topTen(projectId: string, userId: string) {
    const ranking = await this.prisma.rankingSummary.findMany({
      where: { projectId },
      orderBy: [{ totalPoints: 'desc' }, { completedDays: 'desc' }],
      take: 10,
      include: { user: true },
    });

    const userPosition = await this.prisma.rankingSummary.findMany({
      where: { projectId },
      orderBy: [{ totalPoints: 'desc' }, { completedDays: 'desc' }],
    });

    const position = userPosition.findIndex((r) => r.userId === userId) + 1;

    return { top10: ranking, position };
  }

  async fullRanking(projectId: string, municipalityId?: string) {
    return this.prisma.rankingSummary.findMany({
      where: { projectId, ...(municipalityId ? { user: { municipalityId } } : {}) },
      orderBy: [{ totalPoints: 'desc' }, { completedDays: 'desc' }],
      include: { user: true },
    });
  }
}
