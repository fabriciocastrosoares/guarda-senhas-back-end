import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { CardsRepository } from './cards.repository';
import { CryptrService } from '../crypto/cryptr.service';
import { User } from '@prisma/client';

@Injectable()
export class CardsService {
  constructor(
    private readonly cardsRepository: CardsRepository,
    private readonly cryptrService: CryptrService
  ) { }

  async create(createCardDto: CreateCardDto, user: User) {
    const { id: userId } = user;
    const card = await this.cardsRepository.findByTitle(createCardDto.title, userId);
    if (card) throw new ConflictException("Title already in use!");

    const { numbercard, securitycode, cardpassword } = createCardDto;
    return this.cardsRepository.create({
      title: createCardDto.title,
      nameprintedcard: createCardDto.nameprintedcard,
      expirationdate: createCardDto.expirationdate,
      cardtype: createCardDto.cardtype,
      numbercard: createCardDto.numbercard,
      securitycode: this.cryptrService.encrypt(securitycode),
      cardpassword: this.cryptrService.encrypt(cardpassword)
    }, userId);
  }

  async findAll(user: User) {
    const cards = await this.cardsRepository.findAll(user);
    return cards;
  }

  async findOne(id: number, user: User) {
    const { id: userId } = user; 
    const card = await this.cardsRepository.findOne(id);
    if (!card) throw new NotFoundException("Card not found!");
    if(userId !== card?.userId) throw new ForbiddenException("Card belonging to another user!");
    return card;
  }

  async update(id: number, updateCardDto: UpdateCardDto, user: User) {
    await this.findOne(id, user);
    return this.cardsRepository.update(id, updateCardDto);
  }

  async remove(id: number, user: User) {
    await this.findOne(id, user);
    return this.cardsRepository.remove(id);
  }
}
