import { OutboxStatusEnum } from 'src/enum/outboxStatusEnum.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('outbox')
export class Outbox {
	@PrimaryGeneratedColumn('uuid')
	id: string;

	@Column({
		type: 'enum',
		enum: OutboxStatusEnum,
	})
	status: OutboxStatusEnum;

	@Column()
	topic: string;

	@Column({ name: 'event_key' })
	eventKey: string;

	@Column({ type: 'jsonb', name: 'event_data' })
	eventData: Record<string, any>;

	@Column({ name: 'created_at', type: 'timestamp', default: () => 'now()' })
	createdAt: Date;

	@Column({ name: 'published_at', type: 'timestamp', nullable: true })
	publishedAt: Date | null;
}
