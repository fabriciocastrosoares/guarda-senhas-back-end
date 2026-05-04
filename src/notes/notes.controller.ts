import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { NotesService } from './notes.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';
import type { User as UserPrisma } from '@prisma/client';

@UseGuards(AuthGuard)
@Controller('notes')
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post()
  create(@User() user: UserPrisma, @Body() createNoteDto: CreateNoteDto) {
    return this.notesService.create(createNoteDto, user);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.notesService.findAll(user);
  }

  @Get(':id')
  findOne(@User() user: UserPrisma, @Param('id') id: string) {
    return this.notesService.findOne(+id, user);
  }

  @Put(':id')
  update(@User() user: UserPrisma, @Param('id') id: string, @Body() updateNoteDto: UpdateNoteDto) {
    return this.notesService.update(+id, updateNoteDto, user);
  }

  @Delete(':id')
  remove(@User() user: UserPrisma, @Param('id') id: string) {
    return this.notesService.remove(+id, user);
  }
}
