import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException,
	UseGuards,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { IssuedBook } from '../db/entities/issued-book.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateIssuedBookDto } from '../issued-book-api/rest/dto/create-issued-book.dto';
import { ConfigService } from '@nestjs/config';
import { GraphqlAuthGuard } from '../auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from '../auth/guards/graphql-role.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../enums/role.enum';
import { IssuedBookState } from '../enums/IssuedBookState.enum';
import { IssuedBookDto } from '../issued-book-api/rest/dto/query-issued-book.dto';
import { IssuedBookMapper } from '../issued-book-api/mapper/issued-book.mapper';
import { Outbox } from '../db/entities/outbox.entity';
import { OutboxStatusEnum } from '../enums/outboxStatusEnum.enum';

@Injectable()
@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Roles(Role.Client)
export class IssuedBooksService {
	private readonly logger = new Logger(IssuedBooksService.name);

	constructor(
		private readonly configService: ConfigService,
		@InjectRepository(IssuedBook)
		private readonly issuedBooksRepository: Repository<IssuedBook>,
		@InjectRepository(Outbox)
		private readonly outboxRepository: Repository<Outbox>,
		private readonly dataSource: DataSource,
	) {}

	async findAll(status?: IssuedBookState): Promise<IssuedBookDto[]> {
		return (
			await this.issuedBooksRepository.find({
				relations: ['user', 'book'],
				where: {
					state: status,
				},
			})
		).map(issuedBookEntity => IssuedBookMapper.EntityToDto(issuedBookEntity));
	}

	async returnBook(id: string): Promise<IssuedBookDto> {
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

		await this.issuedBooksRepository.update(id, issuedBook);

		const updatedIssuedBook = await this.findOne(id);

		if (!updatedIssuedBook) {
			throw new NotFoundException('Borrow not found');
		}

		return updatedIssuedBook;
	}

	async create(
		createIssuedBookDto: CreateIssuedBookDto,
	): Promise<IssuedBookDto> {
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
		return IssuedBookMapper.EntityToDto(
			await this.issuedBooksRepository.save(issuedBook),
		);
	}

	findMyIssuedBooks(userId: string) {
		return this.issuedBooksRepository.find({
			where: {
				userId,
			},
		});
	}

	findByUserId(userId: string): Promise<IssuedBookDto[]> {
		return this.issuedBooksRepository.find({
			where: {
				userId,
			},
			relations: ['user', 'book'],
		});
	}

	async findByBookId(bookId: string): Promise<IssuedBookDto[]> {
		return IssuedBookMapper.EntityToDtoList(
			await this.issuedBooksRepository.find({
				where: {
					bookId,
				},
				relations: ['user', 'book'],
			}),
		);
	}

	async findOne(id: string): Promise<IssuedBookDto | null> {
		const issuedBook = await this.issuedBooksRepository.findOne({
			where: { id },
			relations: ['user', 'book'],
		});

		return issuedBook ? IssuedBookMapper.EntityToDto(issuedBook) : null;
	}

	async checkIfLoanIsOverdue() {
		const daysToReturnBook = this.configService.get<number>(
			'DAYS_TO_RETURN_BOOK',
		);

		if (!daysToReturnBook) {
			this.logger.error('Days to return book not defined');
			throw new InternalServerErrorException('Days to return book not defined');
		}

		await this.dataSource.transaction(async manager => {
			const sevenDaysAgo = new Date(Date.now() - daysToReturnBook * 1000);

			const overdueBooks = await manager
				.getRepository(IssuedBook)
				.createQueryBuilder('issued_book')
				.where('issued_book.returned_at IS NULL')
				.andWhere('issued_book.issued_at < :sevenDaysAgo', {
					sevenDaysAgo,
				})
				.getMany();

			for (const book of overdueBooks) {
				const existingOutboxEvent = await this.outboxRepository.findOne({
					where: {
						eventKey: book.id.toString(),
					},
				});

				if (!existingOutboxEvent) {
					const outboxEvent = this.outboxRepository.create({
						id: crypto.randomUUID(),
						status: OutboxStatusEnum.WAITING,
						topic: 'overdue-loans',
						eventKey: book.id.toString(),
						eventData: {
							bookId: book.id,
							userId: book.userId,
							issuedAt: book.issuedAt,
						},
						createdAt: new Date(),
						publishedAt: null,
					});

					await manager.save(Outbox, outboxEvent);
				}
			}
		});
	}

	onModuleInit() {
		this.logger.log('IssuedBooksService initialized');
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(async () => {
			this.logger.log('Checking if any loan is overdue');
			await this.checkIfLoanIsOverdue();
		}, 5000);
	}
}
