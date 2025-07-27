import {
	Args,
	Context,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';
import { IssuedBook } from './dto/issued-book.type';
import { IssuedBooksService } from 'src/lib/issued-book/issued-book.service';
import {
	NotFoundException,
	ParseUUIDPipe,
	UnauthorizedException,
	UseGuards,
} from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/lib/auth/guards/graphql-auth.guard';
import { GraphqlRolesGuard } from 'src/lib/auth/guards/graphql-role.guard';
import { Roles } from 'src/lib/auth/decorators/roles.decorator';
import { Role } from 'src/lib/enums/role.enum';
import { Book } from 'src/lib/book-api/graphql/dto/book.type';
import { GqlContext } from 'src/lib/shared/graphql-context.interface';
import { CreateIssuedBookInput } from './dto/create-issued-book.input';
import { IssuedBookState } from 'src/lib/enums/IssuedBookState.enum';
import { BookMapper } from 'src/lib/book/mapper/book.mapper';
import { IssuedBookMapper } from '../mapper/issued-book.mapper';

@Resolver(() => IssuedBook)
@UseGuards(GraphqlAuthGuard, GraphqlRolesGuard)
@Roles(Role.Client)
export class IssuedBookResolver {
	constructor(private readonly issuedBookService: IssuedBooksService) {}

	@Mutation(() => IssuedBook, { name: 'issueBook' })
	async issueBook(
		@Args('createIssuedBookInput', { type: () => CreateIssuedBookInput })
		createIssuedBookInput: CreateIssuedBookInput,
	) {
		return this.issuedBookService.create(createIssuedBookInput);
	}

	@Mutation(() => IssuedBook, { name: 'returnBook' })
	async returnBook(
		@Args('issuedBookId', ParseUUIDPipe) issuedBookId: string,
	): Promise<IssuedBook> {
		const issuedBook = await this.issuedBookService.returnBook(issuedBookId);
		return IssuedBookMapper.DtoToObjectType(issuedBook);
	}

	@Query(() => [IssuedBook], { name: 'allIssuedBooks' })
	async allIssuedBooks(
		@Args('status', {
			type: () => IssuedBookState,
			nullable: true,
		})
		status: IssuedBookState,
	) {
		const issuedBooks = await this.issuedBookService.findAll(status);
		return issuedBooks.map(issuedBook =>
			IssuedBookMapper.DtoToObjectType(issuedBook),
		);
	}

	@Query(() => IssuedBook, { name: 'issuedBook' })
	async issuedBook(@Args('id', ParseUUIDPipe) id: string) {
		return this.issuedBookService.findOne(id);
	}

	@Query(() => [IssuedBook], { name: 'myIssuedBooks' })
	async myIssuedBooks(@Context() context: GqlContext) {
		const { user } = context.req;
		if (!user) {
			throw new UnauthorizedException('User not found');
		}
		const issuedBooks = await this.issuedBookService.findByUserId(user.sub);
		return issuedBooks.map(issuedBook =>
			IssuedBookMapper.DtoToObjectType(issuedBook),
		);
	}

	@ResolveField('book', () => Book, { nullable: false })
	async getBook(
		@Parent() issuedBook: IssuedBook,
		@Context() context: GqlContext,
	) {
		const book = await context.bookDataLoader?.load(issuedBook.bookId);

		if (!book) {
			throw new NotFoundException('Book not found');
		}

		return BookMapper.EntityToObjectType(book);
	}
}
