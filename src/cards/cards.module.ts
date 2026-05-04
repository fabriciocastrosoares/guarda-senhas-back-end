import { Module, forwardRef } from '@nestjs/common';
import { CardsService } from './cards.service';
import { CardsController } from './cards.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { CryptoModule } from '../crypto/crypto.module';
import { CardsRepository } from './cards.repository';

@Module({
  imports: [AuthModule, PrismaModule, forwardRef(() => UsersModule), CryptoModule],
  controllers: [CardsController],
  providers: [CardsService, CardsRepository],
  exports: [CardsRepository],
})
export class CardsModule {}
