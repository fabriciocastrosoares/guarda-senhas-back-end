import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptrService } from '../crypto/cryptr.service';

@Injectable()
export class CardsRepository {

  constructor(
    private readonly prisma: PrismaService,
    private readonly cryptrService: CryptrService
  ) { }

  create(createCardDto: CreateCardDto, userId: number) {
    return this.prisma.card.create({
      data: {
        userId,
        ...createCardDto
      }
    });
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  findByTitle(title: string, userId: number) {
    return this.prisma.card.findUnique({
      where: {
        title_userId: {
          title,
          userId
        }
      }
    })
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
