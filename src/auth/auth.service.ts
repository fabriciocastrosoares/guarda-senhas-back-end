import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { signUpDto } from './dto/signup.dto';
import { signInDto } from './dto/signin.dto ';
import { UsersService } from '../users/users.service';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    private AUDIENCE = "users";
    private ISSUER = "Fabricio";

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

        const valid = this.userService.isMatchForPassword(user, password);
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

    checkToken(token: string) {
        try {
            const data = this.jwtService.verify(token, {
                audience: this.AUDIENCE,
                issuer: this.ISSUER
            });
            return data;
        } catch (error) {
            throw new BadRequestException(error);
        }

    }

}
