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
				entities: [User, Book, IssuedBook],
				synchronize: configService.get('SYNCHRONIZE'),
			}),
			inject: [ConfigService],
		}),
		GraphQLModule.forRoot<ApolloDriverConfig>({
			driver: ApolloDriver,
			autoSchemaFile: true,
			playground: true,
		}),
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
