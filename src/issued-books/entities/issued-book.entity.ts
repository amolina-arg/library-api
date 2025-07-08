import { Book } from 'src/books/entities/book.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'issued_books' })
export class IssuedBook {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column()
	bookId: string;

	@Column()
	userId: string;

	@ManyToOne(() => User, user => user.issuedBooks)
	user: User;

	@ManyToOne(() => Book, book => book.issuedBooks)
	book: Book;
}
