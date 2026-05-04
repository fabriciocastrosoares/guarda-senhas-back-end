import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersRepository {

  constructor(private readonly prisma: PrismaService) { }

  create(userDto: CreateUserDto) {
    return this.prisma.user.create({
      data: userDto
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id }
    });
    
    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id }
    });
  }

  getUserByUsername(username: string) {
    throw new Error('Method not implemented.');
  }

  getUserByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email }
    });
  }

  getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id }
    });
  }
}
