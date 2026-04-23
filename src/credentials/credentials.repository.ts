import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptrService } from '../crypto/cryptr.service';


@Injectable()
export class CredentialsRepository {

    constructor(
        private readonly prisma: PrismaService,
        private readonly cryptrService: CryptrService
    ) { }

    create(createCredentialDto: CreateCredentialDto, userId: number) {
        return this.prisma.credential.create({
            data: {
                userId,
                ...createCredentialDto
            }
        });
    }

    async findAll() {
        const credentials = await this.prisma.credential.findMany();
        return credentials.map(credential => {
            return {
                ...credential,
                password: this.cryptrService.decrypt(credential.password)
            }
        })
    }

      async findOne(id: number) {
        const credential = await this.prisma.credential.findUnique({
          where: { id }
        });

        return {
          ...credential,
          password: credential?.password ? this.cryptrService.decrypt(credential.password) : undefined
        }
      }

    findByTitle(title: string, userId: number) {
        return this.prisma.credential.findUnique({
            where: {
                title_userId: {
                    title,
                    userId
                }
            }
        })
    }

    //   update(id: number, updateCredentialDto: UpdateCredentialDto) {
    //     return this.prisma.credential.update({
    //       where: { id },
    //       data: {
    //         ...updateCredentialDto,
    //         password:
    //       }
    //     });
    //   }

    remove(id: number) {
        return this.prisma.credential.delete({
            where: { id }
        });
    }
}
