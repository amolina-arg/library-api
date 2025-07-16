import { Resolver } from '@nestjs/graphql';
import { IssuedBook } from './dto/issued-book.type';
import { IssuedBooksService } from 'src/lib/issued-book/issued-book.service';

@Resolver(() => IssuedBook)
export class IssuedBookResolver {
	constructor(private readonly issuedBookService: IssuedBooksService) {}
}
