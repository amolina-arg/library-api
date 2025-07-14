import { Module } from '@nestjs/common';
import { BooksApiController } from './book-api.controller';
import { BooksModule } from '../book/books.module';
import { AuthModule } from 'src/lib/auth/auth.module';

@Module({
	controllers: [BooksApiController],
	imports: [BooksModule, AuthModule],
})
export class BookApiModule {}
