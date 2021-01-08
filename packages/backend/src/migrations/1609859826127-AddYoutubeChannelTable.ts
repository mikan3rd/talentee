import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeChannelTable1609859826127 implements MigrationInterface {
  name = "AddYoutubeChannelTable1609859826127";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `youtubeKeywords` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_22bd0967b44be9bfc2d0bfb9ac` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtubeChannels` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `country` varchar(255) NOT NULL, `publishedAt` datetime NOT NULL, `subscriberCount` bigint UNSIGNED NULL DEFAULT NULL, `viewCount` bigint UNSIGNED NOT NULL, `videoCount` bigint UNSIGNED NOT NULL, `hiddenSubscriberCount` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_channels_keywords` (`channel_id` varchar(255) NOT NULL, `keyword_id` int NOT NULL, INDEX `IDX_4ace088512d4393091961ddbc8` (`channel_id`), INDEX `IDX_a3367a144a2ab2c9a0c4595261` (`keyword_id`), PRIMARY KEY (`channel_id`, `keyword_id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `youtubeChannels` ADD CONSTRAINT `FK_c6ae27acf3bf4ab1d0dd04480db` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_channels_keywords` ADD CONSTRAINT `FK_4ace088512d4393091961ddbc8a` FOREIGN KEY (`channel_id`) REFERENCES `youtubeChannels`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_channels_keywords` ADD CONSTRAINT `FK_a3367a144a2ab2c9a0c45952613` FOREIGN KEY (`keyword_id`) REFERENCES `youtubeKeywords`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `youtube_channels_keywords` DROP FOREIGN KEY `FK_a3367a144a2ab2c9a0c45952613`",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_channels_keywords` DROP FOREIGN KEY `FK_4ace088512d4393091961ddbc8a`",
    );
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP FOREIGN KEY `FK_c6ae27acf3bf4ab1d0dd04480db`");
    await queryRunner.query("DROP INDEX `IDX_a3367a144a2ab2c9a0c4595261` ON `youtube_channels_keywords`");
    await queryRunner.query("DROP INDEX `IDX_4ace088512d4393091961ddbc8` ON `youtube_channels_keywords`");
    await queryRunner.query("DROP TABLE `youtube_channels_keywords`");
    await queryRunner.query("DROP TABLE `youtubeChannels`");
    await queryRunner.query("DROP INDEX `IDX_22bd0967b44be9bfc2d0bfb9ac` ON `youtubeKeywords`");
    await queryRunner.query("DROP TABLE `youtubeKeywords`");
  }
}