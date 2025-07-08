import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

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
	migrations: ['src/db/migrations/*.ts'],
	migrationsTableName: 'migrations',
	migrationsRun: true,
	logging: true,
	entities: ['src/**/*.entity.ts'],
});
