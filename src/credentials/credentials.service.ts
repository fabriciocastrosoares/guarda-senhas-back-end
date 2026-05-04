import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
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

    async findAll(user: User) {
        const credentials = await this.credentialsRepository.findAll(user);
        return credentials;
    }

    async findOne(id: number, user: User) {
        const { id: userId } = user;        
        const credential = await this.credentialsRepository.findOne(id);
        if (!credential) throw new NotFoundException("Credential not found!");
        if(userId !== credential?.userId) throw new ForbiddenException("Credentials belonging to another user!");
        return credential;
    }

    async update(id: number, updateCredentialDto: UpdateCredentialDto, user: User) {
        await this.findOne(id, user);
        return this.credentialsRepository.update(id, updateCredentialDto);
    }

    async remove(id: number, user: User) {
        await this.findOne(id, user);
        return this.credentialsRepository.remove(id);
    }
}
