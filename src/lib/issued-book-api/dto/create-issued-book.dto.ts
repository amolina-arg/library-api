import { IsNotEmpty, IsUUID } from 'class-validator';

export class CreateIssuedBookDto {
	@IsNotEmpty()
	@IsUUID()
	bookId: string;

	@IsNotEmpty()
	@IsUUID()
	userId: string;
}
