import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateRefreshSessionTable1624226544645
  implements MigrationInterface
{
  name = 'CreateRefreshSessionTable1624226544645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "refresh_session" ("id" SERIAL NOT NULL, "refreshToken" uuid NOT NULL, "expiresIn" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "userUid" uuid, CONSTRAINT "PK_5d0d8c21064803b5b2baaa50cbb" PRIMARY KEY ("id"))`,
    );

    await queryRunner.query(
      `ALTER TABLE "refresh_session" ADD CONSTRAINT "FK_b3e604e79a20669fb9b960fdfcb" FOREIGN KEY ("userUid") REFERENCES "user"("uid") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_session" DROP CONSTRAINT "FK_b3e604e79a20669fb9b960fdfcb"`,
    );
    await queryRunner.query(`DROP TABLE "refresh_session"`);
  }
}
