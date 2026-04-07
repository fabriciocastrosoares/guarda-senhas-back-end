import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class signInDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;


}