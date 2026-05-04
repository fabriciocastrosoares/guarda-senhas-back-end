import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { BcryptService } from '../crypto/bcrypt.service';
import { User } from '@prisma/client';
import { EraseAccountDto } from './dto/erase-account.dto';

@Injectable()
export class UsersService {

  constructor(
    private readonly usersRepository: UsersRepository, private readonly bcrypt: BcryptService) { }

  async create(userDto: CreateUserDto) {
    const { email, password } = userDto;
    const existEmail = await this.usersRepository.getUserByEmail(email)
    if (existEmail) throw new ConflictException("Email already in use.");

    return await this.usersRepository.create({
      ...userDto,
      password: this.bcrypt.hash(password)
    });
  }

  async findOne(id: number, user: User) {

    const userExist = await this.usersRepository.findOne(id);
    if (!userExist) throw new NotFoundException("User not found!");
    return userExist;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async remove(user: User, eraseAccountDto: EraseAccountDto) {
    const { id: userId, password: hash } = user;
    const { password } = eraseAccountDto;

    const isMatch = this.isMatchForPassword(user, password);
    if (!isMatch) throw new UnauthorizedException("Invalid password");

    return this.usersRepository.remove(userId);
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
    const pass = this.bcrypt.isMatch(password, user.password);
    return pass;
  }
}
