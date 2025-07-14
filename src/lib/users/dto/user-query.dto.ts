import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UserDto {
	@IsUUID()
	@IsNotEmpty()
	public id: string;

	@IsString()
	@IsNotEmpty()
	public username: string;

	@IsString()
	@IsNotEmpty()
	public password: string;
}
