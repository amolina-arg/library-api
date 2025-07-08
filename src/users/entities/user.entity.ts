import { IssuedBook } from 'src/issued-books/entities/issued-book.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500 })
	username: string;

	@Column('text')
	password: string;

	@OneToMany(() => IssuedBook, issuedBook => issuedBook.user)
	issuedBooks: IssuedBook[];
}
