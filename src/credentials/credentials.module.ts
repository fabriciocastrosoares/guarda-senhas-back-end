import { Module, forwardRef } from '@nestjs/common';
import { CredentialsService } from './credentials.service';
import { CredentialsController } from './credentials.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { CredentialsRepository } from './credentials.repository';
import { CryptoModule } from '../crypto/crypto.module';

@Module({
  imports: [AuthModule, PrismaModule, forwardRef(() => UsersModule), CryptoModule],
  controllers: [CredentialsController],
  providers: [CredentialsService, CredentialsRepository],
  exports: [CredentialsRepository],
})
export class CredentialsModule {}
