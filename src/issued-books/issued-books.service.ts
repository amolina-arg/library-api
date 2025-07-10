import {
	BadRequestException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { IssuedBook, IssuedBookState } from './entities/issued-book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIssuedBookDto } from './dto/create-issued-book.dto';

@Injectable()
export class IssuedBooksService {
	constructor(
		@InjectRepository(IssuedBook)
		private readonly issuedBooksRepository: Repository<IssuedBook>,
	) {}

	findAll() {
		return this.issuedBooksRepository.find();
	}

	async returnBook(id: string) {
		const issuedBook = await this.issuedBooksRepository.findOne({
			where: { id },
		});

		const now = new Date();

		const sevenDaysInMs = 7 * 24 * 60 * 60 * 1000;

		if (!issuedBook) {
			throw new NotFoundException('Borrow not found');
		}

		if (issuedBook.returnedAt) {
			throw new BadRequestException('Book already returned');
		}

		if (issuedBook.state != IssuedBookState.ISSUED) {
			throw new BadRequestException('Book is not issued');
		}

		issuedBook.state =
			now.getTime() - issuedBook.issuedAt.getTime() < sevenDaysInMs
				? (issuedBook.state = IssuedBookState.RETURNED)
				: IssuedBookState.OVERDUE;

		issuedBook.returnedAt = new Date();

		return this.issuedBooksRepository.save(issuedBook);
	}

	async create(createIssuedBookDto: CreateIssuedBookDto) {
		const existingIssuedBook = await this.issuedBooksRepository.findOne({
			where: {
				bookId: createIssuedBookDto.bookId,
				state: IssuedBookState.ISSUED,
			},
		});

		if (existingIssuedBook) {
			throw new BadRequestException('Book already issued');
		}

		const issuedBook = new IssuedBook();

		issuedBook.bookId = createIssuedBookDto.bookId;
		issuedBook.userId = createIssuedBookDto.userId;
		return this.issuedBooksRepository.save(issuedBook);
	}
}
