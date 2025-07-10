import { Book } from '../../books/entities/book.entity';
import { User } from '../../users/entities/user.entity';
import {
	Column,
	Entity,
	ManyToOne,
	PrimaryGeneratedColumn,
	JoinColumn,
} from 'typeorm';

export enum IssuedBookState {
	ISSUED = 'issued',
	RETURNED = 'returned',
	OVERDUE = 'overdue',
}

@Entity({ name: 'issued_books' })
export class IssuedBook {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({ name: 'book_id' })
	bookId: string;

	@Column({ name: 'user_id' })
	userId: string;

	@Column({ name: 'issued_at', type: 'timestamp', default: () => 'now()' })
	issuedAt: Date;

	@Column({ name: 'returned_at', type: 'timestamp', nullable: true })
	returnedAt: Date | null;

	@Column({
		name: 'state',
		type: 'enum',
		enum: IssuedBookState,
		default: IssuedBookState.ISSUED,
	})
	state: IssuedBookState;

	@ManyToOne(() => User, user => user.issuedBooks)
	@JoinColumn({ name: 'user_id' })
	user: User;

	@ManyToOne(() => Book, book => book.issuedBooks)
	@JoinColumn({ name: 'book_id' })
	book: Book;
}
