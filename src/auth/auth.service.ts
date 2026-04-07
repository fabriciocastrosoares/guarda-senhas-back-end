import { Injectable } from '@nestjs/common';
import { signUpDto } from './dto/signup.dto';
import { signInDto } from './dto/signin.dto ';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {

    constructor(private readonly userService: UsersService) { }

    async signUp(signUpDto: signUpDto) {
        const user = await this.userService.create(signUpDto);
    }

    sigIn(signInDto: signInDto) {
        throw new Error('Method not implemented.');
    }

}
