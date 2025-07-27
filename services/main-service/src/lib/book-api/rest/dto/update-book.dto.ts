import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateBookDto {
	@IsString()
	@IsOptional()
	@MaxLength(500)
	title: string;

	@IsString()
	@IsOptional()
	@MaxLength(500)
	author: string;
}
