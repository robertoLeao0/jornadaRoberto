import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';

@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.taskService.create(createTaskDto);
  }

  @Get()
  findAll() {
    return this.taskService.findAllActive();
  }

  // ATENÇÃO: Mantenha este ANTES do Get(':id')
  @Get('admin')
  findAllAdmin() {
    return this.taskService.findAllAdmin();
  }

  // --- NOVAS ROTAS ---
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.taskService.update(+id, data);
  }


  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.taskService.remove(+id);
  }
}