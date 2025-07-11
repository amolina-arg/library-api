import type { Role } from 'src/enums/role.enum';

export class UserToken {
	sub: string;
	username: string;
	role: Role;
}
