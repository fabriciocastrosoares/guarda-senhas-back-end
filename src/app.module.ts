import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { CredentialsModule } from './credentials/credentials.module';
import { NotesModule } from './notes/notes.module';
import { CardsModule } from './cards/cards.module';
import { AuthModule } from './auth/auth.module';
import { CryptoModule } from './crypto/crypto.module';


@Module({
  imports: [UsersModule, CredentialsModule, NotesModule, CardsModule, AuthModule, CryptoModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
