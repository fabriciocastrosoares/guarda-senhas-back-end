import { Injectable, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './dto/signup.dto';
import { signInDto } from './dto/signin.dto ';
import { UsersService } from '../users/users.service';
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UsersService) { }

    async signUp(signUpDto: signUpDto) {
        return await this.userService.create(signUpDto);
    }

    async signIn(signInDto: signInDto) {
        const { email, password } = signInDto;
        const user = await this.userService.getUserByEmail(email);
        if (!user) throw new UnauthorizedException("Email or password not valid.");

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new UnauthorizedException("Email or password not valid.");

        return this.createToken(user);


    }

    createToken(user: User) {
        const { id, email } = user;
        const token = this.jwtService.sign(
            { email, sub: String(id) }
        );
        return { token };
    }

}
