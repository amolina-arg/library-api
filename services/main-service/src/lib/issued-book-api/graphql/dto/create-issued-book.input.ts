import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';

@InputType()
export class CreateIssuedBookInput {
	@Field({ nullable: false })
	@IsNotEmpty()
	@IsUUID()
	bookId: string;

	@Field({ nullable: false })
	@IsNotEmpty()
	@IsUUID()
	userId: string;
}
