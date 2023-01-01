import {MigrationInterface, QueryRunner} from "typeorm";

export class TransfersUserSendId1672535478550 implements MigrationInterface {
    name = 'TransfersUserSendId1672535478550'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_da838838004c4ff8990e7b4de9a"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c"`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "statements"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_57d6dd911f94b8a6d31cf0541fd" FOREIGN KEY ("send_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_da838838004c4ff8990e7b4de9a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statements" DROP CONSTRAINT "FK_da838838004c4ff8990e7b4de9a"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_57d6dd911f94b8a6d31cf0541fd"`);
        await queryRunner.query(`ALTER TABLE "transfers" DROP CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c"`);
        await queryRunner.query(`COMMENT ON COLUMN "statements"."id" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."id" IS NULL`);
        await queryRunner.query(`ALTER TABLE "transfers" ADD CONSTRAINT "FK_ba27d1ebe999481ff98cfe51f6c" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statements" ADD CONSTRAINT "FK_da838838004c4ff8990e7b4de9a" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
