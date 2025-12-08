import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service'; // Caminho corrigido
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService { // Nome singular para combinar com seu arquivo
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        dataPrevista: new Date(data.dataPrevista),
        ativo: true,
      },
    });
  }

  async findAllActive() {
    return await this.prisma.task.findMany({
      where: { ativo: true },
      orderBy: { dataPrevista: 'asc' },
    });
  }

  async findAllAdmin() {
    return await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async remove(id: number) {
    return await this.prisma.task.update({
      where: { id },
      data: { ativo: false },
    });
  }
}