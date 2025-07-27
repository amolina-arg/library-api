import { Role } from './../../enums/role.enum';
import { IssuedBook } from './issued-book.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500 })
	username: string;

	@Column('text')
	password: string;

	@Column({ type: 'enum', enum: Role, default: Role.Client })
	role: Role;

	@OneToMany(() => IssuedBook, issuedBook => issuedBook.user)
	issuedBooks: IssuedBook[];
}
