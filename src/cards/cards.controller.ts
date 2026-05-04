import { Controller, Get, Post, Body, Param, Delete, UseGuards, Put } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { User } from '../decorators/user.decorator';
import type { User as UserPrisma } from '@prisma/client';
import { AuthGuard } from '../guards/auth.guard';

@UseGuards(AuthGuard)
@Controller('cards')
export class CardsController {
  constructor(private readonly cardsService: CardsService) { }

  @Post()
  create(@User() user: UserPrisma, @Body() createCardDto: CreateCardDto) {
    return this.cardsService.create(createCardDto, user);
  }

  @Get()
  findAll(@User() user: UserPrisma) {
    return this.cardsService.findAll(user);
  }

  @Get(':id')
  findOne(@User() user: UserPrisma, @Param('id') id: string) {
    return this.cardsService.findOne(+id, user);
  }

  @Put(':id')
  update(@User() user: UserPrisma, @Param('id') id: string, @Body() updateCardDto: UpdateCardDto) {
    return this.cardsService.update(+id, updateCardDto, user);
  }

  @Delete(':id')
  remove(@User() user: UserPrisma, @Param('id') id: string) {
    return this.cardsService.remove(+id, user);
  }
}
