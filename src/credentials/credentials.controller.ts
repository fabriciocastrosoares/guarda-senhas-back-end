import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import type { User as UserPrisma } from '@prisma/client';
import { CredentialsService } from './credentials.service';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { AuthGuard } from '../guards/auth.guard';
import { User } from '../decorators/user.decorator';

@UseGuards(AuthGuard)
@Controller('credentials')

export class CredentialsController {
  constructor(private readonly credentialsService: CredentialsService) { }

  @Post()
  create(@User() user: UserPrisma, @Body() createCredentialDto: CreateCredentialDto) {
    return this.credentialsService.create(createCredentialDto, user);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.credentialsService.findAll(user);
  }

  @Get(':id')
  findOne(@User() user: UserPrisma,  @Param('id') id: string) {
    return this.credentialsService.findOne(+id, user);
  }

  @Put(":id")
  update(@User() user: UserPrisma, @Param("id") id: string, @Body() updateCredentialDto: UpdateCredentialDto) {
    return this.credentialsService.update(+id, updateCredentialDto, user);
  }

  @Delete(':id')
  remove(@User() user: UserPrisma, @Param('id') id: string) {
    return this.credentialsService.remove(+id, user);
  }
}
