import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka/kafka.producer.service';
import { OutboxModule } from './outbox/outbox.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Outbox } from './db/entities/outbox.entity';

@Module({
	imports: [
		OutboxModule,
		ClientsModule.register([
			{
				name: 'KAFKA_SERVICE',
				transport: Transport.KAFKA,
				options: {
					client: {
						clientId: 'nestjs-consumer',
						brokers: ['localhost:9092'],
					},
					consumer: {
						groupId: 'nestjs-consumer-group',
					},
				},
			},
		]),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => {
				return {
					type: 'postgres',
					host: configService.get('POSTGRES_HOST'),
					port: configService.get('POSTGRES_PORT'),
					username: configService.get('POSTGRES_USER'),
					password: configService.get('POSTGRES_PASSWORD'),
					database: configService.get('POSTGRES_DATABASE'),
					entities: [Outbox],
					synchronize: false,
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [KafkaProducerService],
})
export class AppModule {}
