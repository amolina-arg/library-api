import { IsNotEmpty, IsString, MaxLength } from "class-validator";

export class CreateBookDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    title: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    author: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(500)
    isbn: string;
}
