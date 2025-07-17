import { Module } from '@nestjs/common';
import { IssuedBookModule } from '../issued-book/issued-book.module';
import { IssuedBookApiController } from './rest/issued-book-api.controller';
import { AuthModule } from '../auth/auth.module';
import { IssuedBookResolver } from './graphql/issued-book.resolver';
import { UsersModule } from '../user/users.module';
import { BooksModule } from '../book/books.module';
import { BookDataLoader } from './book.dataloader';

@Module({
	imports: [IssuedBookModule, UsersModule, BooksModule, AuthModule],
	controllers: [IssuedBookApiController],
	providers: [IssuedBookResolver, BookDataLoader],
})
export class IssuedBookApiModule {}
