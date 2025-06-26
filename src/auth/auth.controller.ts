import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserDto } from 'src/users/dto/user-query.dto';
import { UserCreateDto } from 'src/users/dto/user-create.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('login')
    async login(@Body(new ValidationPipe()) userCreateDto: UserCreateDto) {
        return this.authService.signIn(userCreateDto.username, userCreateDto.password);
    }
}
