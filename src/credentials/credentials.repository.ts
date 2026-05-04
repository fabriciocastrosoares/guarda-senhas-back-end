import { Injectable } from '@nestjs/common';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { PrismaService } from '../prisma/prisma.service';
import { CryptrService } from '../crypto/cryptr.service';
import { User } from '@prisma/client';


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

    async findAll(user: User) {
        const { id: userId } = user;
        const credentials = await this.prisma.credential.findMany({
            where: { userId }
        });
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

        if (!credential) return null;

        return {
            ...credential,
            password: this.cryptrService.decrypt(credential.password)
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

    update(id: number, updateCredentialDto: UpdateCredentialDto) {
        return this.prisma.credential.update({
            where: { id },
            data: {
                ...updateCredentialDto,
                password: updateCredentialDto.password !== undefined 
                    ? this.cryptrService.encrypt(updateCredentialDto.password)
                    : undefined
            }
        })
    }

    remove(id: number) {
        return this.prisma.credential.delete({
            where: { id }
        });
    }

    removeByUserId(userId: number) {
        return this.prisma.credential.deleteMany({
            where: { userId }
        });
    }
}
