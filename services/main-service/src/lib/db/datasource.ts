import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { IssuedBook } from './entities/issued-book.entity';

dotenv.config();

export default new DataSource({
	type: 'postgres',
	host: process.env.POSTGRES_HOST,
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	port: parseInt(process.env.POSTGRES_PORT!),
	username: process.env.POSTGRES_USER,
	password: process.env.POSTGRES_PASSWORD,
	database: process.env.POSTGRES_DATABASE,
	synchronize: false,
	migrations: ['src/modules/db/migrations/*.ts'],
	migrationsTableName: 'migrations',
	migrationsRun: true,
	logging: true,
	entities: [User, Book, IssuedBook],
});
