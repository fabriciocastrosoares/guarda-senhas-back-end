import { Test, TestingModule } from '@nestjs/testing';
import { NotesService } from './notes.service';
import { NotesRepository } from './notes.repository';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

describe('NotesService', () => {
  let service: NotesService;
  let repository: NotesRepository;

  const mockUser = {
    id: 1,
    username: "fabricio",
    email: "fabricio@email.com",
    password: "123"
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotesService, NotesRepository, PrismaService],
    }).compile();

    service = module.get<NotesService>(NotesService);
    repository = module.get<NotesRepository>(NotesRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a note', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'My Note',
        annotation: 'Some text',
        label: 'My Label',
        name: 'My Name',
      };
      const createdNote = { id: 1, ...createNoteDto, userId: mockUser.id };

      jest.spyOn(repository, 'findByTitle').mockResolvedValue(null);
      jest.spyOn(repository, 'create').mockResolvedValue(createdNote as any);

      const result = await service.create(createNoteDto, mockUser);

      expect(result).toEqual(createdNote);
      expect(repository.findByTitle).toHaveBeenCalledWith(createNoteDto.title, mockUser.id);
      expect(repository.create).toHaveBeenCalledWith(createNoteDto, mockUser);
    });

    it('should throw a ConflictException if the title is already in use by the user', async () => {
      const createNoteDto: CreateNoteDto = {
        title: 'My Note',
        annotation: 'Some text',
        label: 'My Label',
        name: 'My Name',
      };
      
      jest.spyOn(repository, 'findByTitle').mockResolvedValue({ id: 1, title: 'My Note', userId: mockUser.id } as any);

      await expect(service.create(createNoteDto, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of notes for the user', async () => {
      const notes = [{ id: 1, title: 'My Note', userId: mockUser.id }];
      jest.spyOn(repository, "findAll").mockResolvedValue(notes as any);

      const result = await service.findAll(mockUser);
      
      expect(result).toHaveLength(1);
      expect(result).toEqual(notes);
      expect(repository.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a note if found and belongs to the user', async () => {
      const note = { id: 1, title: 'My Note', userId: mockUser.id } as any;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(note);

      const result = await service.findOne(1, mockUser);
      expect(result).toEqual(note);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if note is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ForbiddenException if note belongs to another user', async () => {
      const note = { id: 1, title: 'My Note', userId: 2 } as any; 
      jest.spyOn(repository, 'findOne').mockResolvedValue(note);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should successfully update a note', async () => {
      const note = { id: 1, title: 'My Note', userId: mockUser.id } as any;
      const updateDto: UpdateNoteDto = { title: 'Updated Note' };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(note);
      jest.spyOn(repository, 'update').mockResolvedValue({ ...note, ...updateDto });

      const result = await service.update(1, updateDto, mockUser);

      expect(result.title).toEqual('Updated Note');
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should successfully remove a note', async () => {
      const note = { id: 1, title: 'My Note', userId: mockUser.id } as any;
      
      jest.spyOn(service, 'findOne').mockResolvedValue(note);
      jest.spyOn(repository, 'remove').mockResolvedValue(note);

      const result = await service.remove(1, mockUser);

      expect(result).toEqual(note);
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});
