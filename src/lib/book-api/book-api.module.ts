import { Module } from '@nestjs/common';
import { BooksApiController } from './rest/book-api.controller';
import { BooksModule } from '../book/books.module';
import { AuthModule } from 'src/lib/auth/auth.module';
import { BookResolver } from './graphql/book.resolver';

@Module({
	controllers: [BooksApiController],
	providers: [BookResolver],
	imports: [BooksModule, AuthModule],
})
export class BookApiModule {}
