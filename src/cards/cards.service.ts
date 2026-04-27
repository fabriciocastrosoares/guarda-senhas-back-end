import { ConflictException, Injectable } from '@nestjs/common';
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
    if(card) throw new ConflictException("Title already in use!");

    const { numbercard, securitycode, cardpassword } = createCardDto;
        return this.cardsRepository.create({
            title: createCardDto.title,
            nameprintedcard: createCardDto.nameprintedcard,
            expirationdate: createCardDto.expirationdate,
            cardtype: createCardDto.cardtype,
            numbercard: this.cryptrService.encrypt(numbercard),
            securitycode: this.cryptrService.encrypt(securitycode),
            cardpassword: this.cryptrService.encrypt(cardpassword)
        }, userId);
  }

  findAll() {
    return `This action returns all cards`;
  }

  findOne(id: number) {
    return `This action returns a #${id} card`;
  }

  update(id: number, updateCardDto: UpdateCardDto) {
    return `This action updates a #${id} card`;
  }

  remove(id: number) {
    return `This action removes a #${id} card`;
  }
}
