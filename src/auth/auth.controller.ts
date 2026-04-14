import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signUpDto } from './dto/signup.dto';
import { signInDto } from './dto/signin.dto ';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post("sign-up")
    signUp(@Body() signUpDto: signUpDto) {
        return this.authService.signUp(signUpDto);

    }

    @Post("sign-in")
    signIn(@Body() signInDto: signInDto) {
        return this.authService.signIn(signInDto);

    }

}
