import { Injectable } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptrService } from '../crypto/cryptr.service';
import { User } from '@prisma/client';

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

  async findAll(user: User) {
    const { id: userId } = user;
    const cards = await this.prisma.card.findMany({
      where: { userId }
    });
    return cards.map(card => {
      return {
        ...card,
        securitycode: this.cryptrService.decrypt(card.securitycode),
        cardpassword: this.cryptrService.decrypt(card.cardpassword)
      }
    })
  }

  async findOne(id: number) {
    const card = await this.prisma.card.findUnique({
      where: { id }
    });

    if (!card) return null;

    return {
      ...card,
      securitycode: this.cryptrService.decrypt(card.securitycode),
      cardpassword: this.cryptrService.decrypt(card.cardpassword)
    }
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
    return this.prisma.card.update({
      where: { id },
      data: {
        ...updateCardDto,
        securitycode: updateCardDto.securitycode !== undefined
          ? this.cryptrService.encrypt(updateCardDto.securitycode)
          : undefined,
        cardpassword: updateCardDto.cardpassword !== undefined
          ? this.cryptrService.encrypt(updateCardDto.cardpassword)
          : undefined
      }
    })
  }

  remove(id: number) {
    return this.prisma.card.delete({
      where: { id }
    });
  }

  removeByUserId(userId: number) {
    return this.prisma.card.deleteMany({
      where: { userId }
    });
  }
}
