import type { MigrationInterface, QueryRunner } from 'typeorm';

export class OutboxPattern1753705336274 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`
			CREATE TYPE "outbox_status_enum" AS ENUM ('waiting', 'sent')
		`);

		await queryRunner.query(`
			CREATE TABLE "outbox" (
				"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
				"status" "outbox_status_enum" NOT NULL DEFAULT 'waiting',
				"topic" character varying NOT NULL,
				"event_key" character varying NOT NULL,
				"event_data" jsonb NOT NULL,
				"created_at" TIMESTAMP NOT NULL DEFAULT now(),
				"published_at" TIMESTAMP,
				CONSTRAINT "PK_outbox_id" PRIMARY KEY ("id")
			)
		`);

		await queryRunner.query(`
			CREATE INDEX "IDX_outbox_status" ON "outbox" ("status")
		`);

		await queryRunner.query(`
			CREATE INDEX "IDX_outbox_topic" ON "outbox" ("topic")
		`);

		await queryRunner.query(`
			CREATE INDEX "IDX_outbox_created_at" ON "outbox" ("created_at")
		`);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query('DROP INDEX "IDX_outbox_created_at"');
		await queryRunner.query('DROP INDEX "IDX_outbox_topic"');
		await queryRunner.query('DROP INDEX "IDX_outbox_status"');

		await queryRunner.query('DROP TABLE "outbox"');

		await queryRunner.query('DROP TYPE "outbox_status_enum"');
	}
}
