import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Book } from '../db/entities/book.entity';
import { In, Repository } from 'typeorm';
import { CreateBookDto } from '../book-api/rest/dto/create-book.dto';
import { UpdateBookDto } from '../book-api/rest/dto/update-book.dto';
import { IssuedBookState } from '../enums/IssuedBookState.enum';

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

	findByIds(ids: string[]) {
		return this.booksRepository.findBy({ id: In(ids) });
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
