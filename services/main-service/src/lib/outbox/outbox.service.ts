import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Outbox } from '../db/entities/outbox.entity';
import { Repository } from 'typeorm';
import { OutboxStatusEnum } from '../enums/outboxStatusEnum.enum';

@Injectable()
export class OutboxService {
	constructor(
		@InjectRepository(Outbox)
		private readonly outboxRepository: Repository<Outbox>,
		//private readonly kafkaProducer: KafkaProducerService,
	) {}

	async processEvents() {
		const events = await this.outboxRepository.find({
			where: { status: OutboxStatusEnum.PENDING },
		});

		for (const event of events) {
			//await this.kafkaProducer.sendMessage('order-events', event.payload);
			//event.processed = true;
			await this.outboxRepository.save(event);
		}
	}

	onModuleInit() {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(() => this.processEvents(), 5000); // Run every 5 seconds
	}
}
