import type { MigrationInterface, QueryRunner } from 'typeorm';

export class BooksTable1751665048564 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "books" (
                "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL,
                "title" VARCHAR(500) NOT NULL,
                "author" VARCHAR(500) NOT NULL,
                "isbn" VARCHAR(500) NOT NULL
            )`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP TABLE "books"');
	}
}
