import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameColumnsToSnakeCase1624397894738
  implements MigrationInterface
{
  name = 'RenameColumnsToSnakeCase1624397894738';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "createdAt" TO "created_at"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "refreshToken" TO "refresh_token"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "expiresIn" TO "expires_in"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "userUid" TO "user_uid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" RENAME COLUMN "sortOrder" TO "sort_order"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "created_at" TO "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "refresh_token" TO "refreshToken"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "expires_in" TO "expiresIn"`,
    );
    await queryRunner.query(
      `ALTER TABLE "refresh_session" RENAME COLUMN "user_uid" TO "userUid"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag" RENAME COLUMN "sort_order" TO "sortOrder"`,
    );
  }
}
