import { Field, ObjectType } from '@nestjs/graphql';
import { Role } from 'src/lib/auth/enums/role.enum';

@ObjectType()
export class User {
	@Field({ nullable: false })
	id: string;

	@Field({ nullable: false })
	username: string;

	@Field({ nullable: false })
	password: string;

	@Field(() => Role, { nullable: false })
	role: Role;
}
