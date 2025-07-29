import { Injectable, Logger } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { SchemaRegistryService } from './schemaRegistry.service';

@Injectable()
export class KafkaProducerService {
	private readonly logger = new Logger(KafkaProducerService.name);
	private kafka = new Kafka({ brokers: ['localhost:9092'] });
	private producer = this.kafka.producer();
	private schemaRegistryService: SchemaRegistryService =
		new SchemaRegistryService();

	async sendMessage(
		topic: string,
		message: {
			bookId: string;
			userId: string;
			issuedAt: string;
		},
		key: string,
	) {
		await this.producer.connect();
		this.logger.log(`Sending message to topic ${topic}`);

		const keyPayload = { issuedBookId: key };
		const valuePayload = {
			bookId: message.bookId,
			userId: message.userId,
			issuedAt: new Date(message.issuedAt).getTime(),
		};

		//TODO: Change this to use the schema registry with avro files
		const encodedKey = await this.schemaRegistryService.encode(2, keyPayload);
		const encodedValue = await this.schemaRegistryService.encode(
			1,
			valuePayload,
		);

		await this.producer.send({
			topic,
			messages: [
				{
					key: encodedKey,
					value: encodedValue,
				},
			],
		});
		this.logger.log(`Message sent to topic ${topic}`);
		await this.producer.disconnect();
	}

	async getSchema(subject: number) {
		return this.schemaRegistryService.getSchema(subject);
	}

	async registerSchema(schema: string) {
		return this.schemaRegistryService.registerSchema(schema);
	}

	//TODO: Check if this correct
	async createTopic(topic: string) {
		const admin = this.kafka.admin();
		await admin.connect();
		await admin.createTopics({
			topics: [{ topic, numPartitions: 1 }],
		});
		await admin.disconnect();
	}
}
