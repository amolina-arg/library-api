import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class IssuedBook {
	@Field({ nullable: false })
	id: string;

	@Field({ nullable: false })
	userId: string;

	@Field({ nullable: false })
	bookId: string;

	@Field({ nullable: false })
	issuedAt: Date;

	@Field({ nullable: true })
	returnedAt: Date;
}
