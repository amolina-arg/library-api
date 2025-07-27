import { IsDate, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { BookDto } from 'src/lib/book-api/rest/dto/query-book.dto';
import { IssuedBookState } from 'src/lib/enums/IssuedBookState.enum';
import { UserDto } from 'src/lib/user-api/rest/dto/query-user.dto';

export class IssuedBookDto {
	@IsUUID()
	id: string;

	user: UserDto;

	book: BookDto;

	@IsEnum(IssuedBookState)
	state: IssuedBookState;

	@IsDate()
	issuedAt: Date;

	@IsDate()
	@IsOptional()
	returnedAt?: Date;
}
