import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Outbox } from './entities/outbox.entity';
import { IssuedBook } from './entities/issued-book.entity';

dotenv.config();

export default new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	port: parseInt(process.env.POSTGRES_PORT!),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	synchronize: false,
	logging: true,
	entities: [Outbox, IssuedBook],
});
