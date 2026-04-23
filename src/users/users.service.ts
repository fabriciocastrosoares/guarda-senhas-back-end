import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../crypto/bcrypt.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcrypt: BcryptService
  ) { }

  async create(userDto: CreateUserDto) {
    const { email, password } = userDto;
    const existEmail = await this.usersRepository.getUserByEmail(email)
    if (existEmail) throw new ConflictException("Email already in use.");

    return await this.usersRepository.create({
      ...userDto,
      password: this.bcrypt.hash(password)
    });
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getUserByEmail(email: string) {
    return await this.usersRepository.getUserByEmail(email);
  }

  async getUserById(id: number) {
    const user = await this.usersRepository.getUserById(id);
    if (!user) throw new NotFoundException("User not found!");
    return user;
  }

  isMatchForPassword(user: User, password: string) {
    return this.bcrypt.isMatch(password, user.password);
  }
}
