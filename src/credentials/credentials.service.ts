import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import type { User } from '@prisma/client';
import { CreateCredentialDto } from './dto/create-credential.dto';
import { UpdateCredentialDto } from './dto/update-credential.dto';
import { CredentialsRepository } from './credentials.repository';
import { CryptrService } from '../crypto/cryptr.service';

@Injectable()
export class CredentialsService {
    constructor(
        private readonly credentialsRepository: CredentialsRepository,
        private readonly cryptrService: CryptrService
    ) { }

    async create(createCredentialDto: CreateCredentialDto, user: User) {
        const { id: userId } = user;
        const credential = await this.credentialsRepository.findByTitle(createCredentialDto.title, userId);
        if (credential) throw new ConflictException("Title already in use!");

        const { password } = createCredentialDto;
        return this.credentialsRepository.create({
            ...createCredentialDto,
            password: this.cryptrService.encrypt(password)
        }, userId);
    }

    async findAll() {
        const credentials = await this.credentialsRepository.findAll();
        return credentials;
    }

    async findOne(id: number) {
        const credential = await this.credentialsRepository.findOne(id);
        if(!credential) throw new NotFoundException("Credential not found!");
        return credential;
    }

    update(id: number, updateCredentialDto: UpdateCredentialDto) {
        return `This action updates a #${id} credential`;
    }

    remove(id: number) {
        return `This action removes a #${id} credential`;
    }
}
