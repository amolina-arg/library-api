import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { IssuedBook } from '../db/entities/issued-book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIssuedBookDto } from '../issued-book-api/rest/dto/create-issued-book.dto';
import { ConfigService } from '@nestjs/config';
import { GraphqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from '../auth/guards/graphql-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { IssuedBookState } from '../enums/IssuedBookState.enum';

@Injectable()
@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Roles(Role.Client)
export class IssuedBooksService {
	private readonly logger = new Logger(IssuedBooksService.name);

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(IssuedBook)
		private readonly issuedBooksRepository: Repository<IssuedBook>,
	) {}

	findAll() {
		return this.issuedBooksRepository.find({
			relations: ['user'],
		});
	}

	async returnBook(id: string) {
		const issuedBook = await this.issuedBooksRepository.findOne({
			where: { id },
		});

		const now = new Date();

		const daysToReturnBook = this.configService.get<number>(
			'DAYS_TO_RETURN_BOOK',
		);

		if (!daysToReturnBook) {
			this.logger.error('Days to return book not defined');
			throw new InternalServerErrorException('Days to return book not defined');
		}

		const sevenDaysInMs = daysToReturnBook * 24 * 60 * 60 * 1000;

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

		return this.issuedBooksRepository.update(id, issuedBook);
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

	findMyIssuedBooks(userId: string) {
		return this.issuedBooksRepository.find({
			where: {
				userId,
			},
		});
	}

	findByUserId(userId: string) {
		return this.issuedBooksRepository.find({
			where: {
				userId,
			},
		});
	}

	findByBookId(bookId: string) {
		return this.issuedBooksRepository.find({
			where: {
				bookId,
			},
			relations: ['user', 'book'],
		});
	}

	findOne(id: string) {
		console.log(
			this.issuedBooksRepository.findOne({
				where: { id },
				relations: ['user', 'book'],
			}),
		);
		return this.issuedBooksRepository.findOne({
			where: { id },
			relations: ['user', 'book'],
		});
	}
}
