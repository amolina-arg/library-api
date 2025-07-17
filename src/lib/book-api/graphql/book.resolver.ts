import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GraphqlAuthGuard } from 'src/lib/auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from 'src/lib/auth/guards/graphql-role.guard';
import { BooksService } from 'src/lib/book/books.service';
import { Book } from './dto/book.type';
import { CreateBookInput } from './dto/create-book.input';
import { Roles } from 'src/lib/auth/decorators/roles.decorator';
import { Role } from 'src/lib/enums/role.enum';

@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Resolver(() => Book)
@Roles(Role.Client)
export class BookResolver {
	constructor(private readonly bookService: BooksService) {}

	@Query(() => Book, { name: 'book' })
	async book(@Args('id', ParseUUIDPipe) id: string) {
		return this.bookService.findOne(id);
	}

	@Query(() => [Book], { name: 'books' })
	async books() {
		return this.bookService.findAll();
	}

	@Roles(Role.Admin)
	@Mutation(() => Book, { name: 'createBook' })
	async createBook(@Args('createBookInput') createBookInput: CreateBookInput) {
		return this.bookService.create(createBookInput);
	}
}
