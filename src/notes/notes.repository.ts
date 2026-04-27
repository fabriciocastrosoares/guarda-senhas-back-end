import { Injectable } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class NotesRepository {
  constructor(private readonly prisma: PrismaService) { }

  create(createNoteDto: CreateNoteDto, user: User) {
    return this.prisma.note.create({
      data: { 
        userId: user.id,
        ...createNoteDto
      }
    });
  }

  async findAll() {
    return await this.prisma.note.findMany();
  }

  async findOne(id: number) {
    return await this.prisma.note.findUnique({
      where:  { id }
    });
  }

  update(id: number, updateNoteDto: UpdateNoteDto) {
    return this.prisma.note.update({
      where: { id },
      data: { ...updateNoteDto}
    });
  }

  remove(id: number) {
    return this.prisma.note.delete({
      where: { id }
    });
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.note.findUnique({
      where: {
        title_userId: {
          title,
          userId
        }
      }
    })
  }
}
