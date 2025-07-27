import { registerEnumType } from '@nestjs/graphql';

export enum IssuedBookState {
	ISSUED = 'issued',
	RETURNED = 'returned',
	OVERDUE = 'overdue',
}

registerEnumType(IssuedBookState, {
	name: 'IssuedBookState',
	description: 'The supported issued book states.',
});
