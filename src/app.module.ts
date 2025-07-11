import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './modules/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { BooksModule } from './modules/books/books.module';
import { Book } from './modules/books/entities/book.entity';
import { IssuedBooksModule } from './modules/issued-books/issued-books.module';
import { IssuedBook } from './modules/issued-books/entities/issued-book.entity';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		BooksModule,
		LoggerModule.forRoot({
			pinoHttp: {
				transport:
					process.env.NODE_ENV === 'production'
						? undefined
						: {
								target: 'pino-pretty',
								options: {
									messageKey: 'message',
								},
							},
				messageKey: 'message',
			},
		}),
		ConfigModule.forRoot({
			isGlobal: true,
		}),
		TypeOrmModule.forRootAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				type: 'postgres',
				host: configService.get('POSTGRES_HOST'),
				port: configService.get('POSTGRES_PORT'),
				username: configService.get('POSTGRES_USER'),
				password: configService.get('POSTGRES_PASSWORD'),
				database: configService.get('POSTGRES_DATABASE'),
				entities: [User, Book, IssuedBook],
				synchronize: configService.get('SYNCHRONIZE'),
			}),
			inject: [ConfigService],
		}),
		IssuedBooksModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
