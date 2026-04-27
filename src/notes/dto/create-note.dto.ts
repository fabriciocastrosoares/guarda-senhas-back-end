import { IsNotEmpty, IsString } from "class-validator";

export class CreateNoteDto {
      @IsNotEmpty()
      @IsString()
      title: string;
    
      @IsString()
      @IsNotEmpty()
      name: string;
    
      @IsNotEmpty()
      @IsString()
      label: string;
    
      @IsNotEmpty()
      @IsString()
      annotation: string;
}
