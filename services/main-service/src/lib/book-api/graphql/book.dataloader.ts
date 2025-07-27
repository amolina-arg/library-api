import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { BooksService } from '../../book/books.service';
import { Book } from '../../db/entities/book.entity';

@Injectable({ scope: Scope.REQUEST })
export class BookDataLoader {
	constructor(private readonly bookService: BooksService) {}

	createLoader() {
		return new DataLoader<string, Book | null>(async (bookIds: string[]) => {
			const books = await this.bookService.findByIds(bookIds);
			const bookMap = new Map(books.map(book => [book.id, book]));

			return bookIds.map(id => bookMap.get(id) ?? null);
		});
	}
}
