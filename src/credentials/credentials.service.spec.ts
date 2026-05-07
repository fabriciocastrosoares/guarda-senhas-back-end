import { Test, TestingModule } from '@nestjs/testing';
import { CredentialsService } from './credentials.service';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '../crypto/cryptr.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';

describe('CredentialsService', () => {
  let service: CredentialsService;
  let repository: CredentialsRepository;
  let cryptr: CryptrService;

  const mockUser = {
    id: 1,
    username: "fabricio",
    email: "fabricio@email.com",
    password: "123"
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CredentialsService, CredentialsRepository, CryptrService, PrismaService],
    }).compile();

    service = module.get<CredentialsService>(CredentialsService);
    repository = module.get<CredentialsRepository>(CredentialsRepository);
    cryptr = module.get<CryptrService>(CryptrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a credential', async () => {
      const createCredentialDto: CreateCredentialDto = { 
        title: 'My Credential', 
        url: 'http://example.com',
        username: 'fabricio_test',
        password: 'password123'
      };
      const createdCredential = { id: 1, ...createCredentialDto, userId: mockUser.id };

      jest.spyOn(repository, 'findByTitle').mockResolvedValue(null);
      jest.spyOn(cryptr, 'encrypt').mockReturnValue('encryptedPassword');
      jest.spyOn(repository, 'create').mockResolvedValue(createdCredential as any);

      const result = await service.create(createCredentialDto, mockUser);

      expect(result).toEqual(createdCredential);
      expect(repository.findByTitle).toHaveBeenCalledWith(createCredentialDto.title, mockUser.id);
      expect(cryptr.encrypt).toHaveBeenCalledWith(createCredentialDto.password);
      expect(repository.create).toHaveBeenCalledWith({
        ...createCredentialDto,
        password: 'encryptedPassword'
      }, mockUser.id);
    });

    it('should throw a ConflictException if the title is already in use by the user', async () => {
      const createCredentialDto: CreateCredentialDto = { 
        title: 'My Credential', 
        url: 'http://example.com',
        username: 'fabricio_test',
        password: 'password123'
      };
      
      jest.spyOn(repository, 'findByTitle').mockResolvedValue({ id: 1, ...createCredentialDto, userId: mockUser.id } as any);

      await expect(service.create(createCredentialDto, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of credentials for the user', async () => {
      const credentials = [{ id: 1, title: 'My Credential', userId: mockUser.id }];
      jest.spyOn(repository, "findAll").mockResolvedValue(credentials as any);

      const result = await service.findAll(mockUser);
      
      expect(result).toHaveLength(1);
      expect(result).toEqual(credentials);
      expect(repository.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a credential if found and belongs to the user', async () => {
      const credential = { id: 1, title: 'My Credential', userId: mockUser.id } as any;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(credential);

      const result = await service.findOne(1, mockUser);
      expect(result).toEqual(credential);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if credential is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ForbiddenException if credential belongs to another user', async () => {
      const credential = { id: 1, title: 'My Credential', userId: 2 } as any; 
      jest.spyOn(repository, 'findOne').mockResolvedValue(credential);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should successfully update a credential', async () => {
      const credential = { id: 1, title: 'My Credential', userId: mockUser.id } as any;
      const updateDto: UpdateCredentialDto = { title: 'Updated Credential' };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(credential);
      jest.spyOn(repository, 'update').mockResolvedValue({ ...credential, ...updateDto });

      const result = await service.update(1, updateDto, mockUser);

      expect(result.title).toEqual('Updated Credential');
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should successfully remove a credential', async () => {
      const credential = { id: 1, title: 'My Credential', userId: mockUser.id } as any;
      
      jest.spyOn(service, 'findOne').mockResolvedValue(credential);
      jest.spyOn(repository, 'remove').mockResolvedValue(credential);

      const result = await service.remove(1, mockUser);

      expect(result).toEqual(credential);
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});
