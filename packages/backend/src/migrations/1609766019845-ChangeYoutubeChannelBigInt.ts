import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeYoutubeChannelBigInt1609766019845 implements MigrationInterface {
  name = "ChangeYoutubeChannelBigInt1609766019845";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeKeywords` CHANGE `num` `num` int UNSIGNED NOT NULL DEFAULT '0'");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `subscriberCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `subscriberCount` bigint UNSIGNED NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `viewCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `viewCount` bigint UNSIGNED NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` CHANGE `videoCount` `videoCount` int UNSIGNED NOT NULL");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeChannels` CHANGE `videoCount` `videoCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `viewCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `viewCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `subscriberCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `subscriberCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeKeywords` CHANGE `num` `num` int NOT NULL DEFAULT '0'");
  }
}
