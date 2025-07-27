import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { IssuedBook } from './entities/issued-book.entity';
import { UsersTable1751663141903 } from './migrations/1751663141903-users-table';
import { BooksTable1751665048564 } from './migrations/1751665048564-books-table';
import { IssuedBooksTable1751665282323 } from './migrations/1751665282323-issued-books-table';
import { RoleSupport1752266530295 } from './migrations/1752266530295-role-support';

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
	migrations: [
		UsersTable1751663141903,
		BooksTable1751665048564,
		IssuedBooksTable1751665282323,
		RoleSupport1752266530295,
	],
	migrationsTableName: 'migrations',
	migrationsRun: true,
	logging: true,
	entities: [User, Book, IssuedBook],
});
