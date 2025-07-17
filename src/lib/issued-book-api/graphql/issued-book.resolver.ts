import {
	Args,
	Context,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { IssuedBook } from './dto/issued-book.type';
import { IssuedBooksService } from 'src/lib/issued-book/issued-book.service';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/lib/auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from 'src/lib/auth/guards/graphql-role.guard';
import { Roles } from 'src/lib/auth/decorators/roles.decorator';
import { Role } from 'src/lib/enums/role.enum';
import { Book } from 'src/lib/book-api/graphql/dto/book.type';
import { GqlContext } from 'src/lib/shared/graphql-context.interface';

@Resolver(() => IssuedBook)
@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Roles(Role.Client)
export class IssuedBookResolver {
	constructor(private readonly issuedBookService: IssuedBooksService) {}

	@Query(() => [IssuedBook], { name: 'issuedBooks' })
	async issuedBooks() {
		return this.issuedBookService.findAll();
	}

	@Query(() => IssuedBook, { name: 'issuedBook' })
	async issuedBook(@Args('id', ParseUUIDPipe) id: string) {
		return this.issuedBookService.findOne(id);
	}

	/* @ResolveField('user', () => User, { nullable: false })
	async getUser(@Parent() issuedBook: IssuedBook) {
		return this.userService.findOneById(issuedBook.userId);
	} */

	@ResolveField('book', () => Book, { nullable: false })
	getBook(@Parent() issuedBook: IssuedBook, @Context() context: GqlContext) {
		return context.bookDataLoader?.load(issuedBook.bookId);
	}
}
