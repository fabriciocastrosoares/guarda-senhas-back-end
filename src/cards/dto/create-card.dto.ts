import { IsNotEmpty, IsString, IsDateString } from "class-validator";

export class CreateCardDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    @IsString()
    numbercard: string;

    @IsNotEmpty()
    @IsString()
    nameprintedcard: string;

    @IsNotEmpty()
    @IsString()
    securitycode: string;

    @IsNotEmpty()
    @IsDateString()
    expirationdate: string;

    @IsNotEmpty()
    @IsString()
    cardpassword: string;

    @IsNotEmpty()
    @IsString()
    cardtype: string;
}
