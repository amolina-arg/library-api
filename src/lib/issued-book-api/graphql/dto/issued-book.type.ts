import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IssuedBook {
	@Field()
	id: string;

	@Field()
	bookId: string;

	@Field()
	userId: string;

	@Field()
	issuedAt: Date;

	@Field()
	returnedAt: Date;
}
