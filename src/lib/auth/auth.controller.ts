import {
	Body,
	Controller,
	Get,
	Post,
	Request,
	UseGuards,
	ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/lib/users/dto/user-query.dto';
import { UserCreateDto } from 'src/lib/users/dto/user-create.dto';
import { AuthGuard } from './guards/auth.guard';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('login')
	async login(@Body(new ValidationPipe()) userCreateDto: UserCreateDto) {
		return this.authService.signIn(
			userCreateDto.username,
			userCreateDto.password,
		);
	}

	@UseGuards(AuthGuard)
	@Get('user-logged')
	userLogged(@Request() { user }: { user: UserDto }) {
		return this.authService.userLogged(user);
	}
}
