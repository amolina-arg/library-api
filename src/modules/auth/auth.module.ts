import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from 'src/modules/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
	controllers: [AuthController],
	providers: [AuthService],
	imports: [
		UsersModule,
		JwtModule.registerAsync({
			imports: [ConfigModule],
			useFactory: (configService: ConfigService) => ({
				global: true,
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '3600s' },
			}),
			inject: [ConfigService],
		}),
	],
	exports: [AuthService, JwtModule],
})
export class AuthModule {}
