import { IsString, IsUUID, MaxLength } from 'class-validator';

export class BookDto {
	@IsUUID()
	id: string;

	@IsString()
	@MaxLength(500)
	title: string;

	@IsString()
	@MaxLength(500)
	author: string;

	@IsString()
	@MaxLength(500)
	isbn: string;
}
