import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initialize1625431650154 implements MigrationInterface {
  name = 'Initialize1625431650154';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("id" SERIAL NOT NULL, "name" character varying(40) NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "creatorUid" uuid, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("uid" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying(100) NOT NULL, "password" character varying(100) NOT NULL, "nickname" character varying(30) NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e2364281027b926b879fa2fa1e0" UNIQUE ("nickname"), CONSTRAINT "PK_df955cae05f17b2bcf5045cc021" PRIMARY KEY ("uid"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "refresh_session" ("id" SERIAL NOT NULL, "refreshToken" uuid NOT NULL, "expiresIn" bigint NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(), "userUid" uuid, CONSTRAINT "PK_5d0d8c21064803b5b2baaa50cbb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_tags_tag" ("userUid" uuid NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_c41bca5e2414d8ce45228d59418" PRIMARY KEY ("userUid", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_26803958fcfaa45f86ffd3dbde" ON "user_tags_tag" ("userUid") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ff76db199db490dda3ed74231e" ON "user_tags_tag" ("tagId") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_ff76db199db490dda3ed74231e"`);
    await queryRunner.query(`DROP INDEX "IDX_26803958fcfaa45f86ffd3dbde"`);
    await queryRunner.query(`DROP TABLE "user_tags_tag"`);
    await queryRunner.query(`DROP TABLE "refresh_session"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
