import {MigrationInterface, QueryRunner} from "typeorm";

export class TransfersUser1672532086814 implements MigrationInterface {
    name = 'TransfersUser1672532086814'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "statements"`);
        await queryRunner.query(`CREATE TYPE "transfers_type_enum" AS ENUM('received', 'sent')`);
        await queryRunner.query(`CREATE TABLE "transfers" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "send_id" uuid NOT NULL, "description" character varying NOT NULL, "amount" numeric(5,2) NOT NULL, "type" "transfers_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f712e908b465e0085b4408cabc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`COMMENT ON COLUMN "statements"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_da838838004c4ff8990e7b4de9a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_da838838004c4ff8990e7b4de9a"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c"`);
        await queryRunner.query(`COMMENT ON COLUMN "statements"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."email" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS NULL`);
        await queryRunner.query(`DROP TABLE "transfers"`);
        await queryRunner.query(`DROP TYPE "transfers_type_enum"`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "statements" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
