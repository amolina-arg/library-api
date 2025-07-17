import { Field, ObjectType } from '@nestjs/graphql';
import { Book } from 'src/lib/book-api/graphql/dto/book.type';
import { IssuedBookState } from 'src/lib/enums/IssuedBookState.enum';
import { User } from 'src/lib/user-api/graphql/dto/user.type';

@ObjectType()
export class IssuedBook {
	@Field({ nullable: false })
	id: string;

	@Field(() => User, { nullable: false })
	user: User;

	@Field(() => Book, { nullable: false })
	book: Book;

	@Field(() => IssuedBookState)
	state: IssuedBookState;

	// TODO: remove this field after show alternative with dataloading
	@Field({ nullable: false })
	bookId: string;

	@Field({ nullable: false })
	issuedAt: Date;

	@Field({ nullable: true })
	returnedAt: Date;
}
