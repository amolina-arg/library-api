import { MigrationInterface, QueryRunner, TableForeignKey } from "typeorm";

export class IssuedBooksTable1751665282323 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "issued_books" (
                "id" uuid DEFAULT gen_random_uuid() PRIMARY KEY,
                "book_id" uuid NOT NULL,
                "user_id" uuid NOT NULL
            )`,
        )
        await queryRunner.createForeignKey(
            'issued_books',
            new TableForeignKey({
                columnNames: ['book_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'books',
            }),
        )
        await queryRunner.createForeignKey(
            'issued_books',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey(
            'issued_books',
            new TableForeignKey({
                columnNames: ['book_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'books',
            }),
        )
        await queryRunner.dropForeignKey(
            'issued_books',
            new TableForeignKey({
                columnNames: ['user_id'],
                referencedColumnNames: ['id'],
                referencedTableName: 'users',
            }),
        )
        await queryRunner.query(
            `DROP TABLE "issued_books"`,
        )
    }

}
