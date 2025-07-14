import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/lib/auth/decorators/roles.decorator';
import { Role } from 'src/lib/auth/enums/role.enum';
import { UserToken } from 'src/lib/auth/models/UserToken.model';

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private readonly reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		// eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
		if (!requiredRoles || requiredRoles.length === 0) {
			return true;
		}
		const { user }: { user: UserToken } = context.switchToHttp().getRequest();
		return requiredRoles.some(role => user.role === role);
	}
}
