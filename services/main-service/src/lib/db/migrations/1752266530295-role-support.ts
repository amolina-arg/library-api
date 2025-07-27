import type { MigrationInterface, QueryRunner } from 'typeorm';

export class RoleSupport1752266530295 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      CREATE TYPE "user_type_enum" AS ENUM ('client', 'admin')
    `);

		await queryRunner.query(`
      ALTER TABLE "users"
      ADD COLUMN "type" "user_type_enum" NOT NULL DEFAULT 'client'
    `);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
      ALTER TABLE "users"
      DROP COLUMN "type"
    `);

		await queryRunner.query(`
      DROP TYPE "user_type_enum"
    `);
	}
}
