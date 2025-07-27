import { Transform } from 'class-transformer';
import { IsString, Length } from 'class-validator';

export class UserDto {
	@IsString()
	@Length(2, 30, { message: 'Username must be between 2 and 30 characters' })
	@Transform(({ value }: { value: string }) => value.trim())
	public readonly username: string;

	@IsString()
	@Length(2, 30, { message: 'Password must be between 2 and 30 characters' })
	@Transform(({ value }: { value: string }) => value.trim())
	public readonly password: string;
}
