import { Injectable, Logger } from '@nestjs/common';
import { Outbox } from '../db/entities/outbox.entity';
import { DataSource, Repository } from 'typeorm';
import { OutboxStatusEnum } from 'src/enum/outboxStatusEnum.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class OutboxService {
	private readonly logger = new Logger(OutboxService.name);

	constructor(
		@InjectRepository(Outbox)
		private readonly outboxRepository: Repository<Outbox>,
		private readonly kafkaProducer: KafkaProducerService,
		private readonly dataSource: DataSource,
	) {}

	async processEvents() {
		const events = await this.outboxRepository.find({
			where: { status: OutboxStatusEnum.WAITING },
		});

		for (const event of events) {
			await this.dataSource.transaction(async manager => {
				await this.kafkaProducer.sendMessage(
					event.topic,
					event.eventData as {
						bookId: string;
						userId: string;
						issuedAt: string;
					},
					event.eventKey,
				);

				event.status = OutboxStatusEnum.SENT;
				event.publishedAt = new Date();
				await manager.save(Outbox, event);
			});
		}
	}

	@Cron(CronExpression.EVERY_10_SECONDS)
	async handleCron() {
		this.logger.log('Processing events');
		await this.processEvents();
	}
}
