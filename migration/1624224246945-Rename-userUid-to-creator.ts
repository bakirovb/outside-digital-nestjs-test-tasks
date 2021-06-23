import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameUserUidToCreator1624224246945 implements MigrationInterface {
  name = 'RenameUserUidToCreator1624224246945';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag" RENAME COLUMN "userUid" TO "creatorUid"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag" RENAME COLUMN "creatorUid" TO "userUid"`,
    );
  }
}
