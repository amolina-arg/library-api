import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDto } from 'src/lib/user-api/rest/dto/query-user.dto';
import { UsersService } from 'src/lib/user/users.service';
import { UserToken } from './models/UserToken.model';

@Injectable()
export class AuthService {
	constructor(
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService,
	) {}

	async signIn(
		username: string,
		pass: string,
	): Promise<{ access_token: string }> {
		const user = await this.usersService.findOne(username);
		if (user?.password !== pass) {
			throw new UnauthorizedException();
		}
		const payload: UserToken = {
			sub: user.id,
			username: user.username,
			role: user.role,
		};
		return {
			access_token: await this.jwtService.signAsync(payload),
		};
	}

	userLogged(user: UserDto): UserDto {
		return { ...user };
	}
}
