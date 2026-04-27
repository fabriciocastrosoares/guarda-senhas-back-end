import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { NotesRepository } from './notes.repository';
import { User } from '@prisma/client';

@Injectable()
export class NotesService {
  constructor(private readonly notesRepository: NotesRepository) { }

  async create(createNoteDto: CreateNoteDto, user: User) {
    const { id: userId } = user;
    const note = await this.notesRepository.findByTitle(createNoteDto.title, userId);
    if (note) throw new ConflictException("Title already in use!");
    return this.notesRepository.create(createNoteDto, user);

  }

  async findAll() {
    const notes = await this.notesRepository.findAll();
    return notes;
  }

  async findOne(id: number) {
    const note = await this.notesRepository.findOne(id);
    if (!note) throw new NotFoundException("Note not found!");
    return note;
  }

  async update(id: number, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);
    return this.notesRepository.update(id, updateNoteDto);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.notesRepository.remove(id);
  }
}
