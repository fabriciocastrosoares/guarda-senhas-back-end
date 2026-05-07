import { Test, TestingModule } from '@nestjs/testing';
import { CardsService } from './cards.service';
import { CardsRepository } from './cards.repository';
import { CryptrService } from '../crypto/cryptr.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ConflictException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

describe('CardsService', () => {
  let service: CardsService;
  let repository: CardsRepository;
  let cryptr: CryptrService;

  const mockUser = {
    id: 1,
    username: "fabricio",
    email: "fabricio@email.com",
    password: "123"
  } as User;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CardsService, CardsRepository, CryptrService, PrismaService],
    }).compile();

    service = module.get<CardsService>(CardsService);
    repository = module.get<CardsRepository>(CardsRepository);
    cryptr = module.get<CryptrService>(CryptrService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a card', async () => {
      const createCardDto: CreateCardDto = { 
        title: 'My Card', 
        numbercard: '123456789',
        nameprintedcard: 'FABRICIO',
        securitycode: '123',
        expirationdate: '12/28',
        cardpassword: 'password123',
        cardtype: 'CREDIT'
      };
      const createdCard = { id: 1, ...createCardDto, userId: mockUser.id };

      jest.spyOn(repository, 'findByTitle').mockResolvedValue(null);
      jest.spyOn(cryptr, 'encrypt').mockReturnValue('encryptedData');
      jest.spyOn(repository, 'create').mockResolvedValue(createdCard as any);

      const result = await service.create(createCardDto, mockUser);

      expect(result).toEqual(createdCard);
      expect(repository.findByTitle).toHaveBeenCalledWith(createCardDto.title, mockUser.id);
      expect(cryptr.encrypt).toHaveBeenCalledWith(createCardDto.securitycode);
      expect(cryptr.encrypt).toHaveBeenCalledWith(createCardDto.cardpassword);
      expect(repository.create).toHaveBeenCalledWith({
        ...createCardDto,
        securitycode: 'encryptedData',
        cardpassword: 'encryptedData'
      }, mockUser.id);
    });

    it('should throw a ConflictException if the title is already in use by the user', async () => {
      const createCardDto: any = { title: 'My Card' };
      
      jest.spyOn(repository, 'findByTitle').mockResolvedValue({ id: 1, title: 'My Card', userId: mockUser.id } as any);

      await expect(service.create(createCardDto, mockUser)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of cards for the user', async () => {
      jest.spyOn(repository, "findAll").mockResolvedValue([]);

      const cards = await service.findAll(mockUser);
      
      expect(cards).toHaveLength(0);
      expect(repository.findAll).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('findOne', () => {
    it('should return a card if found and belongs to the user', async () => {
      const card = { id: 1, title: 'My Card', userId: mockUser.id, cardpassword: 'encrypted', securitycode: 'encrypted' } as any;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(card);

      const result = await service.findOne(1, mockUser);
      expect(result).toEqual(card);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if card is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(NotFoundException);
    });

    it('should throw a ForbiddenException if card belongs to another user', async () => {
      const card = { id: 1, title: 'My Card', userId: 2 } as any; 
      jest.spyOn(repository, 'findOne').mockResolvedValue(card);

      await expect(service.findOne(1, mockUser)).rejects.toThrow(ForbiddenException);
    });
  });

  describe('update', () => {
    it('should successfully update a card', async () => {
      const card = { id: 1, title: 'My Card', userId: mockUser.id } as any;
      const updateDto: UpdateCardDto = { title: 'Updated Card' };
      
      jest.spyOn(service, 'findOne').mockResolvedValue(card);
      jest.spyOn(repository, 'update').mockResolvedValue({ ...card, ...updateDto });

      const result = await service.update(1, updateDto, mockUser);

      expect(result.title).toEqual('Updated Card');
      expect(service.findOne).toHaveBeenCalledWith(1, mockUser);
      expect(repository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  describe('remove', () => {
    it('should successfully remove a card', async () => {
      const card = { id: 1, title: 'My Card', userId: mockUser.id } as any;
      
      jest.spyOn(service, 'findOne').mockResolvedValue(card);
      jest.spyOn(repository, 'remove').mockResolvedValue(card);

      const result = await service.remove(1, mockUser);

      expect(result).toEqual(card);
      expect(repository.remove).toHaveBeenCalledWith(1);
    });
  });
});
