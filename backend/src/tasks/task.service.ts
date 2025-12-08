import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TaskService {
  constructor(private readonly prisma: PrismaService) {}

  // --- NOVO MÉTODO: Verifica e Inativa tarefas vencidas ---
  private async verificarTarefasVencidas() {
    const hoje = new Date();
    // Zera o horário para comparar apenas a data (opcional, depende da sua regra)
    hoje.setHours(0, 0, 0, 0);

    // Atualiza para 'ativo: false' tudo que for menor que hoje e estiver ativo
    await this.prisma.task.updateMany({
      where: {
        ativo: true,
        dataPrevista: { lt: hoje }, // lt = less than (menor que)
      },
      data: { ativo: false },
    });
  }

  async create(data: CreateTaskDto) {
    return await this.prisma.task.create({
      data: {
        nome: data.nome,
        descricao: data.descricao,
        dataPrevista: new Date(data.dataPrevista),
        ativo: data.ativo ?? true,
      },
    });
  }

  async findAllActive() {
    // Antes de devolver a lista, arruma a casa
    await this.verificarTarefasVencidas(); 

    return await this.prisma.task.findMany({
      where: { ativo: true },
      orderBy: { dataPrevista: 'asc' },
    });
  }

  async findAllAdmin() {
    // Aqui também, para garantir que o admin veja o status real
    await this.verificarTarefasVencidas();

    return await this.prisma.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    return await this.prisma.task.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: any) {
    return await this.prisma.task.update({
      where: { id },
      data: {
        nome: data.nome,
        descricao: data.descricao,
        dataPrevista: data.dataPrevista ? new Date(data.dataPrevista) : undefined,
        ativo: data.ativo,
      },
    });
  }

  async remove(id: number) {
    return await this.prisma.task.delete({
      where: { id },
    });
  }
}