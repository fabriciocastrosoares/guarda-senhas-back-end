import { Module, forwardRef } from '@nestjs/common';
import { NotesService } from './notes.service';
import { NotesController } from './notes.controller';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { NotesRepository } from './notes.repository';

@Module({
  imports: [AuthModule, PrismaModule, forwardRef(() => UsersModule)],
  controllers: [NotesController],
  providers: [NotesService, NotesRepository],
  exports: [NotesRepository],
})
export class NotesModule {}
