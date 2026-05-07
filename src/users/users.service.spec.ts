import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { BcryptService } from '../crypto/bcrypt.service';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ConflictException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EraseAccountDto } from './dto/erase-account.dto';

describe('UsersService', () => {
  let service: UsersService;
  let repository: UsersRepository;
  let bcrypt: BcryptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, UsersRepository, BcryptService, PrismaService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<UsersRepository>(UsersRepository);
    bcrypt = module.get<BcryptService>(BcryptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a user', async () => {
      const createUserDto: CreateUserDto = { username: 'test', email: 'test@test.com', password: '123' };
      const createdUser = { id: 1, ...createUserDto, password: 'hashedPassword' } as User;

      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockReturnValue('hashedPassword');
      jest.spyOn(repository, 'create').mockResolvedValue(createdUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(createdUser);
      expect(repository.getUserByEmail).toHaveBeenCalledWith(createUserDto.email);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password);
      expect(repository.create).toHaveBeenCalledWith({ ...createUserDto, password: 'hashedPassword' });
    });

    it('should throw a ConflictException if the email is already in use', async () => {
      const createUserDto: CreateUserDto = { username: 'test', email: 'test@test.com', password: '123' };
      
      jest.spyOn(repository, 'getUserByEmail').mockResolvedValue({ id: 1, ...createUserDto } as User);

      await expect(service.create(createUserDto)).rejects.toThrow(new ConflictException("Email already in use."));
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@test.com', password: '123' } as User;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1, user);
      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      const user = { id: 1, email: 'test@test.com', password: '123' } as User;
      
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(2, user)).rejects.toThrow(new NotFoundException("User not found!"));
    });
  });

  describe('remove', () => {
    it('should successfully remove a user if password matches', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hashedPassword' } as User;
      const eraseDto: EraseAccountDto = { password: '123' };

      jest.spyOn(bcrypt, 'isMatch').mockReturnValue(true);
      jest.spyOn(repository, 'remove').mockResolvedValue(user);

      const result = await service.remove(user, eraseDto);

      expect(result).toEqual(user);
      expect(bcrypt.isMatch).toHaveBeenCalledWith(eraseDto.password, user.password);
      expect(repository.remove).toHaveBeenCalledWith(user.id);
    });

    it('should throw an UnauthorizedException if password does not match', async () => {
      const user = { id: 1, email: 'test@test.com', password: 'hashedPassword' } as User;
      const eraseDto: EraseAccountDto = { password: 'wrongPassword' };

      jest.spyOn(bcrypt, 'isMatch').mockReturnValue(false);

      await expect(service.remove(user, eraseDto)).rejects.toThrow(new UnauthorizedException("Invalid password"));
    });
  });

  describe('getUserById', () => {
    it('should return a user if found', async () => {
      const user = { id: 1, email: 'test@test.com', password: '123' } as User;
      
      jest.spyOn(repository, 'getUserById').mockResolvedValue(user);

      const result = await service.getUserById(1);
      expect(result).toEqual(user);
      expect(repository.getUserById).toHaveBeenCalledWith(1);
    });

    it('should throw a NotFoundException if user is not found', async () => {
      jest.spyOn(repository, 'getUserById').mockResolvedValue(null);

      await expect(service.getUserById(2)).rejects.toThrow(new NotFoundException("User not found!"));
    });
  });
});
