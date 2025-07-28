import { Module } from '@nestjs/common';
import { AuthModule } from './lib/auth/auth.module';
import { UsersModule } from './lib/user/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './lib/db/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { Book } from './lib/db/entities/book.entity';
import { IssuedBook } from './lib/db/entities/issued-book.entity';
import { BookApiModule } from './lib/book-api/book-api.module';
import { IssuedBookApiModule } from './lib/issued-book-api/issued-book-api.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { BookDataLoader } from './lib/book-api/graphql/book.dataloader';
import { BooksService } from './lib/book/books.service';
import { BooksModule } from './lib/book/books.module';
import { Outbox } from './lib/db/entities/outbox.entity';

@Module({
	imports: [
		AuthModule,
		UsersModule,
		IssuedBookApiModule,
		BookApiModule,
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
				entities: [User, Book, IssuedBook, Outbox],
				synchronize: false,
			}),
			inject: [ConfigService],
		}),
		GraphQLModule.forRootAsync<ApolloDriverConfig>({
			driver: ApolloDriver,
			imports: [BooksModule],
			inject: [BooksService],
			useFactory: (bookService: BooksService) => ({
				autoSchemaFile: true,
				playground: false,
				plugins: [ApolloServerPluginLandingPageLocalDefault()],
				context: ({ req }: { req: Request }) => ({
					req,
					bookDataLoader: new BookDataLoader(bookService).createLoader(),
				}),
			}),
		}),
	],
	controllers: [],
})
export class AppModule {}
