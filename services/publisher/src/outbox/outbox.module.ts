import { Module } from '@nestjs/common';
import { OutboxService } from './outbox.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Outbox } from 'src/db/entities/outbox.entity';
import { KafkaProducerService } from 'src/kafka/kafka.producer.service';

@Module({
	imports: [TypeOrmModule.forFeature([Outbox])],
	providers: [OutboxService, KafkaProducerService],
	exports: [OutboxService],
})
export class OutboxModule {}
