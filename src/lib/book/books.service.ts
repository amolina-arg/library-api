import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../db/entities/book.entity';
import { Repository } from 'typeorm';
import { IssuedBookState } from 'src/lib/db/entities/issued-book.entity';
import { CreateBookDto } from '../book-api/rest/dto/create-book.dto';
import { UpdateBookDto } from '../book-api/rest/dto/update-book.dto';

@Injectable()
export class BooksService {
	constructor(
		@InjectRepository(Book)
		private readonly booksRepository: Repository<Book>,
	) {}

	create(createBookDto: CreateBookDto) {
		const book = this.booksRepository.create(createBookDto);
		return this.booksRepository.save(book);
	}

	findAll() {
		return this.booksRepository.find();
	}

	findOne(id: string) {
		return this.booksRepository.findOneBy({ id });
	}

	update(id: string, updateBookDto: UpdateBookDto) {
		return this.booksRepository.update(id, updateBookDto);
	}

	remove(id: string) {
		return this.booksRepository.delete(id);
	}

	findAvailable() {
		const books = this.booksRepository
			.createQueryBuilder('book')
			.leftJoinAndSelect('book.issuedBooks', 'issuedBook')
			.where('issuedBook.state IS NULL OR issuedBook.state != :issued', {
				issued: IssuedBookState.ISSUED,
			})
			.getMany();

		return books;
	}
}
