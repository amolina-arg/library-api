import { registerEnumType } from '@nestjs/graphql';

export enum Role {
	Client = 'client',
	Admin = 'admin',
}

registerEnumType(Role, {
	name: 'Role',
	description: 'The supported roles.',
});
