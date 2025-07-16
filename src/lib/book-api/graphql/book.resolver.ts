import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from 'src/lib/auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from 'src/lib/auth/guards/graphql-role.guard';
import { BooksService } from 'src/lib/book/books.service';
import { Book } from './dto/book.type';
import { CreateBookInput } from './dto/create-book.input';

@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Resolver(() => Book)
export class BookResolver {
	constructor(private readonly bookService: BooksService) {}

	@Query(() => Book, { name: 'book' })
	async book(@Args('id', ParseUUIDPipe) id: string) {
		return this.bookService.findOne(id);
	}

	@Mutation(returns => Book, { name: 'createBook' })
	async createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
		return this.bookService.create(createBookInput);
	}
}
