import {
	Injectable,
	InternalServerErrorException,
	Logger,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Outbox } from '../db/entities/outbox.entity';
import { IssuedBook } from 'src/db/entities/issued-book.entity';
import { OutboxStatusEnum } from 'src/enum/outboxStatusEnum.enum';
import { Cron, CronExpression } from '@nestjs/schedule';
import { IssuedBookState } from 'src/enum/IssuedBookState.enum';

@Injectable()
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
				.andWhere('issued_book.state = :state', {
					state: IssuedBookState.ISSUED,
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
							bookId: book.bookId,
							userId: book.userId,
							issuedAt: book.issuedAt,
						},
						createdAt: new Date(),
						publishedAt: null,
					});

					this.logger.log(`Triggering overdue loan event for ${book.id}`);
					this.logger.debug(`Updating book ${book.id} to overdue`);

					book.state = IssuedBookState.OVERDUE;
					await manager.save(IssuedBook, book);
					await manager.save(Outbox, outboxEvent);
				}
			}
		});
	}

	@Cron(CronExpression.EVERY_10_SECONDS)
	async triggerOverdueLoanEvent() {
		this.logger.log('Checking if any loan is overdue');
		await this.checkIfLoanIsOverdue();
	}
}
