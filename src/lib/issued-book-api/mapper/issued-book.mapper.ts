import type { IssuedBook } from '../graphql/dto/issued-book.type';
import type { IssuedBook as IssuedBookEntity } from 'src/lib/db/entities/issued-book.entity';
import type { IssuedBookDto } from '../rest/dto/query-issued-book.dto';

export class IssuedBookMapper {
	static EntityToDto(issuedBook: IssuedBookEntity): IssuedBookDto {
		return {
			id: issuedBook.id,
			book: issuedBook.book,
			user: issuedBook.user,
			state: issuedBook.state,
			issuedAt: issuedBook.issuedAt,
			returnedAt: issuedBook.returnedAt,
		};
	}

	static EntityToDtoList(issuedBooks: IssuedBookEntity[]): IssuedBookDto[] {
		return issuedBooks.map(issuedBook => this.EntityToDto(issuedBook));
	}

	static EntityToObjectType(issuedBook: IssuedBookEntity): IssuedBook {
		return {
			id: issuedBook.id,
			bookId: issuedBook.bookId,
			//TODO: create Mappers for user and book
			user: issuedBook.user,
			book: issuedBook.book,
			state: issuedBook.state,
			issuedAt: issuedBook.issuedAt,
			returnedAt: issuedBook.returnedAt,
		};
	}

	static ObjectTypetoDto(issuedBook: IssuedBook): IssuedBookDto {
		return {
			id: issuedBook.id,
			book: issuedBook.book,
			user: issuedBook.user,
			state: issuedBook.state,
			issuedAt: issuedBook.issuedAt,
			returnedAt: issuedBook.returnedAt,
		};
	}

	static ObjectTypeToDtoList(issuedBooks: IssuedBook[]): IssuedBookDto[] {
		return issuedBooks.map(issuedBook => this.ObjectTypetoDto(issuedBook));
	}

	static DtoToObjectType(issuedBook: IssuedBookDto): IssuedBook {
		return {
			id: issuedBook.id,
			book: issuedBook.book,
			bookId: issuedBook.book.id,
			user: issuedBook.user,
			state: issuedBook.state,
			issuedAt: issuedBook.issuedAt,
			returnedAt: issuedBook.returnedAt,
		};
	}
}
