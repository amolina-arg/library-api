import type { Book } from 'src/lib/book-api/graphql/dto/book.type';
import type { BookDto } from 'src/lib/book-api/rest/dto/query-book.dto';
import type { Book as BookEntity } from 'src/lib/db/entities/book.entity';

export class BookMapper {
	static EntityToDto(book: BookEntity): BookDto {
		return {
			id: book.id,
			title: book.title,
			author: book.author,
			isbn: book.isbn,
		};
	}

	static EntityToObjectType(book: BookEntity): Book {
		return {
			id: book.id,
			title: book.title,
			author: book.author,
			isbn: book.isbn,
		};
	}
}
