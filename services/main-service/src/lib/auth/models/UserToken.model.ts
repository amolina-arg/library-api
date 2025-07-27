import type { Role } from 'src/lib/enums/role.enum';

export class UserToken {
	sub: string;
	username: string;
	role: Role;
}
