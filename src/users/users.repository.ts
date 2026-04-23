import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {

  constructor(private readonly prsima: PrismaService) { }

  create(userDto: CreateUserDto) {
    return this.prsima.user.create({
      data: userDto
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

  getUserByUsername(username: string) {
    throw new Error('Method not implemented.');
  }

  getUserByEmail(email: string) {
    return this.prsima.user.findUnique({
      where: { email }
    });
  }

  getUserById(id: number) {
    return this.prsima.user.findUnique({
      where: { id }
    });
  }
}
