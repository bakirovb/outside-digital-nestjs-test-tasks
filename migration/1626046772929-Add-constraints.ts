import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddConstraints1626046772929 implements MigrationInterface {
  name = 'AddConstraints1626046772929';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag" ADD CONSTRAINT "FK_1d9e7c347d02fb20f42d68a23cf" FOREIGN KEY ("creatorUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" ADD CONSTRAINT "FK_b3e604e79a20669fb9b960fdfcb" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tags_tag" ADD CONSTRAINT "FK_26803958fcfaa45f86ffd3dbded" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tags_tag" ADD CONSTRAINT "FK_ff76db199db490dda3ed74231e8" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_tags_tag" DROP CONSTRAINT "FK_ff76db199db490dda3ed74231e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_tags_tag" DROP CONSTRAINT "FK_26803958fcfaa45f86ffd3dbded"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" DROP CONSTRAINT "FK_b3e604e79a20669fb9b960fdfcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" DROP CONSTRAINT "FK_1d9e7c347d02fb20f42d68a23cf"`,
    );
  }
}
