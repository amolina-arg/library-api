import { MigrationInterface, QueryRunner } from "typeorm";

export class UsersTable1751663141903 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "user" (
                "id" SERIAL PRIMARY KEY,
                "username" VARCHAR(500) NOT NULL,
                "password" TEXT NOT NULL
            )`,
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `DROP TABLE "user"`,
        )
    }

}
