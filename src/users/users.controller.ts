import { Controller, Get, Post, Body, Param, Delete, Put, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { EraseAccountDto } from './dto/erase-account.dto';
import { User } from '../decorators/user.decorator';
import type { User as UserPrisma } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@User() user: UserPrisma, @Param('id') id: string) {
    return this.usersService.findOne(+id, user);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @UseGuards(AuthGuard)
  @Delete('erase')
  remove(@User() user: UserPrisma, @Body() eraseAccountDto: EraseAccountDto) {
    return this.usersService.remove(user, eraseAccountDto);
  }
}
