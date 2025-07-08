import { Book } from 'src/books/entities/book.entity';
import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	ManyToMany,
	JoinTable,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ length: 500 })
	username: string;

	@Column('text')
	password: string;

	@ManyToMany(() => Book)
	@JoinTable({
		name: 'issued_books',
		joinColumn: { name: 'user_id', referencedColumnName: 'id' },
		inverseJoinColumn: { name: 'book_id', referencedColumnName: 'id' },
	})
	books: Book[];
}
