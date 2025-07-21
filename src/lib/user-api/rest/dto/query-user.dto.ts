import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { Role } from 'src/lib/enums/role.enum';

export class UserDto {
	@IsUUID()
	@IsNotEmpty()
	public id: string;

	@IsString()
	@IsNotEmpty()
	@IsEnum(Role)
	public role: Role;

	@IsString()
	@IsNotEmpty()
	public username: string;

	@IsString()
	@IsNotEmpty()
	public password: string;
}
