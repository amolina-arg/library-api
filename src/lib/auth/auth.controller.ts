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
import { UserDto } from 'src/lib/user-api/rest/dto/query-user.dto';
import { UserCreateDto } from 'src/lib/user-api/rest/dto/create-user.dto';
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
	userLogged(@Request() { user }: { user: UserDto }): UserDto {
		return this.authService.userLogged(user);
	}
}
