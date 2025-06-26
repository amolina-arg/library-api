import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class UserDto {
    @IsInt()
    @IsNotEmpty()
    public id: number;

    @IsString()
    @IsNotEmpty()
    public username: string;

    @IsString()
    @IsNotEmpty()
    public password: string;
}