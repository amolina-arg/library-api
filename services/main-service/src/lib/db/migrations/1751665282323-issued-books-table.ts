import type { MigrationInterface, QueryRunner } from 'typeorm';
import { TableForeignKey } from 'typeorm';

export class IssuedBooksTable1751665282323 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			// eslint-disable-next-line quotes
			`CREATE TYPE "issued_book_state_enum" AS ENUM('issued', 'returned', 'overdue')`,
		);

		await queryRunner.query(
			`CREATE TABLE "issued_books" (
                "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
                "book_id" uuid NOT NULL,
                "user_id" uuid NOT NULL,
				"issued_at" timestamp NOT NULL DEFAULT now(),
				"returned_at" timestamp,
				"state" "issued_book_state_enum" NOT NULL DEFAULT 'issued'
            )`,
		);
		await queryRunner.createForeignKey(
			'issued_books',
			new TableForeignKey({
				columnNames: ['book_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'books',
			}),
		);
		await queryRunner.createForeignKey(
			'issued_books',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
			}),
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropForeignKey(
			'issued_books',
			new TableForeignKey({
				columnNames: ['book_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'books',
			}),
		);
		await queryRunner.dropForeignKey(
			'issued_books',
			new TableForeignKey({
				columnNames: ['user_id'],
				referencedColumnNames: ['id'],
				referencedTableName: 'users',
			}),
		);
		await queryRunner.query('DROP TABLE "issued_books"');
		// Eliminar el tipo enum
		await queryRunner.query("DROP TYPE 'issued_book_state_enum'");
	}
}
