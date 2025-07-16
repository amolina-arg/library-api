import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { IssuedBook } from './dto/issued-book.type';
import { IssuedBooksService } from 'src/lib/issued-book/issued-book.service';
import { User } from 'src/lib/user-api/graphql/dto/user.type';
import { UsersService } from 'src/lib/user/users.service';
import { Book } from 'src/lib/book-api/graphql/dto/book.type';
import { BooksService } from 'src/lib/book/books.service';
import { ParseUUIDPipe } from '@nestjs/common';

@Resolver(() => IssuedBook)
export class IssuedBookResolver {
	constructor(
		private readonly issuedBookService: IssuedBooksService,
		private readonly userService: UsersService,
		private readonly bookService: BooksService,
	) {}

	@Query(() => [IssuedBook], { name: 'issuedBooks' })
	async issuedBooks() {
		return this.issuedBookService.findAll();
	}

	@Query(() => IssuedBook, { name: 'issuedBook' })
	async issuedBook(@Args('id', ParseUUIDPipe) id: string) {
		return this.issuedBookService.findOne(id);
	}

	@ResolveField('user', () => User, { nullable: false })
	async getUser(@Parent() issuedBook: IssuedBook) {
		return this.userService.findOneById(issuedBook.userId);
	}

	@ResolveField('book', () => Book, { nullable: false })
	async getBook(@Parent() issuedBook: IssuedBook) {
		return this.bookService.findOne(issuedBook.bookId);
	}
}
