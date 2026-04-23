import { IsNotEmpty, IsString, IsUrl } from "class-validator";

export class CreateCredentialDto {

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
