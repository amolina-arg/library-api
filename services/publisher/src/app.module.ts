import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaProducerService } from './kafka/kafka.producer.service';
import { OutboxModule } from './outbox/outbox.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Outbox } from './db/entities/outbox.entity';
import { ScheduleModule } from '@nestjs/schedule';
import { IssuedBookModule } from './issued-book/issued-book.module';
import { IssuedBook } from './db/entities/issued-book.entity';

@Module({
	imports: [
		OutboxModule,
		IssuedBookModule,
		ScheduleModule.forRoot(),
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
					entities: [Outbox, IssuedBook],
					synchronize: false,
				};
			},
			inject: [ConfigService],
		}),
	],
	providers: [KafkaProducerService],
})
export class AppModule {}
