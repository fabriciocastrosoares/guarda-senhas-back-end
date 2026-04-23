import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { CryptrService } from './cryptr.service';

@Module({
  providers: [BcryptService, CryptrService],
  exports: [BcryptService, CryptrService]
})
export class CryptoModule {}
