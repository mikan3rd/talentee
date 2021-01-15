import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeVideCountColumn1610638920419 implements MigrationInterface {
  name = "ChangeVideCountColumn1610638920419";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideo` CHANGE `viewCount` `viewCount` bigint UNSIGNED NULL DEFAULT NULL",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `YoutubeVideo` CHANGE `viewCount` `viewCount` bigint UNSIGNED NOT NULL");
  }
}
