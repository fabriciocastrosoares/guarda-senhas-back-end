import { Module } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CryptoModule } from '../crypto/crypto.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [AuthModule, PrismaModule, UsersModule, CryptoModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
})
export class CardsModule {}
