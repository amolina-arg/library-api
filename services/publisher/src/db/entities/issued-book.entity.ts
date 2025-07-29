import { IssuedBookState } from 'src/enum/IssuedBookState.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
	returnedAt?: Date;

	@Column({
		name: 'state',
		type: 'enum',
		enum: IssuedBookState,
		default: IssuedBookState.ISSUED,
	})
	state: IssuedBookState;
}
