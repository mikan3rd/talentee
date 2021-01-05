import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeYoutubeChannelBigInt1609849277636 implements MigrationInterface {
  name = "ChangeYoutubeChannelBigInt1609849277636";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `accountId` varchar(36) NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeKeywords` CHANGE `num` `num` int UNSIGNED NOT NULL DEFAULT '0'");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `subscriberCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `subscriberCount` bigint UNSIGNED NULL DEFAULT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `viewCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `viewCount` bigint UNSIGNED NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` CHANGE `videoCount` `videoCount` int UNSIGNED NOT NULL");
    await queryRunner.query(
      "ALTER TABLE `youtubeChannels` ADD CONSTRAINT `FK_c6ae27acf3bf4ab1d0dd04480db` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP FOREIGN KEY `FK_c6ae27acf3bf4ab1d0dd04480db`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` CHANGE `videoCount` `videoCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `viewCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `viewCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `subscriberCount`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `subscriberCount` int NOT NULL");
    await queryRunner.query("ALTER TABLE `youtubeKeywords` CHANGE `num` `num` int NOT NULL DEFAULT '0'");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `accountId`");
  }
}
