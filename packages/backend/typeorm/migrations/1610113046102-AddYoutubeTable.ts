import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeTable1610113046102 implements MigrationInterface {
  name = "AddYoutubeTable1610113046102";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `youtube_keyword` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_7ad6308bb6d1645c4c7056fb20` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_tag` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_fffdc9f21695c014eb5a479cbd` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_video_category` (`id` int NOT NULL, `title` varchar(255) NOT NULL, `assignable` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_video` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `publishedAt` datetime NOT NULL, `viewCount` bigint UNSIGNED NOT NULL, `likeCount` bigint UNSIGNED NULL DEFAULT NULL, `dislikeCount` bigint UNSIGNED NULL DEFAULT NULL, `commentCount` bigint UNSIGNED NULL DEFAULT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `videoCategoryId` int NOT NULL, `channelId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_channel` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `country` varchar(255) NOT NULL, `publishedAt` datetime NOT NULL, `subscriberCount` bigint UNSIGNED NULL DEFAULT NULL, `viewCount` bigint UNSIGNED NOT NULL, `videoCount` bigint UNSIGNED NOT NULL, `hiddenSubscriberCount` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `account` (`uuid` varchar(36) NOT NULL, `displayName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `thumbnailUrl` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_41dfcb70af895ddf9a53094515` (`username`), PRIMARY KEY (`uuid`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeVideoTagRelation` (`videoId` varchar(255) NOT NULL, `tagId` int NOT NULL, INDEX `IDX_13e9d8647dadb5d352b6ba6833` (`videoId`), INDEX `IDX_be5ac77f3edc4c713a19d34d62` (`tagId`), PRIMARY KEY (`videoId`, `tagId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeChannelKeywordRelation` (`channelId` varchar(255) NOT NULL, `keywordId` int NOT NULL, INDEX `IDX_b18b74d0911b0e08ae917029f8` (`channelId`), INDEX `IDX_e2c8f2d1602712387ea922c295` (`keywordId`), PRIMARY KEY (`channelId`, `keywordId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_video` ADD CONSTRAINT `FK_c31343c7c577b50cc27ff7535b8` FOREIGN KEY (`videoCategoryId`) REFERENCES `youtube_video_category`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_video` ADD CONSTRAINT `FK_a0354d90aed385b4a1df831d0e4` FOREIGN KEY (`channelId`) REFERENCES `youtube_channel`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_channel` ADD CONSTRAINT `FK_0475525b19b8b43ecf69f1b9935` FOREIGN KEY (`accountId`) REFERENCES `account`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoTagRelation` ADD CONSTRAINT `FK_13e9d8647dadb5d352b6ba6833b` FOREIGN KEY (`videoId`) REFERENCES `youtube_video`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoTagRelation` ADD CONSTRAINT `FK_be5ac77f3edc4c713a19d34d620` FOREIGN KEY (`tagId`) REFERENCES `youtube_tag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` ADD CONSTRAINT `FK_b18b74d0911b0e08ae917029f81` FOREIGN KEY (`channelId`) REFERENCES `youtube_channel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` ADD CONSTRAINT `FK_e2c8f2d1602712387ea922c295a` FOREIGN KEY (`keywordId`) REFERENCES `youtube_keyword`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` DROP FOREIGN KEY `FK_e2c8f2d1602712387ea922c295a`",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` DROP FOREIGN KEY `FK_b18b74d0911b0e08ae917029f81`",
    );
    await queryRunner.query("ALTER TABLE `YoutubeVideoTagRelation` DROP FOREIGN KEY `FK_be5ac77f3edc4c713a19d34d620`");
    await queryRunner.query("ALTER TABLE `YoutubeVideoTagRelation` DROP FOREIGN KEY `FK_13e9d8647dadb5d352b6ba6833b`");
    await queryRunner.query("ALTER TABLE `youtube_channel` DROP FOREIGN KEY `FK_0475525b19b8b43ecf69f1b9935`");
    await queryRunner.query("ALTER TABLE `youtube_video` DROP FOREIGN KEY `FK_a0354d90aed385b4a1df831d0e4`");
    await queryRunner.query("ALTER TABLE `youtube_video` DROP FOREIGN KEY `FK_c31343c7c577b50cc27ff7535b8`");
    await queryRunner.query("DROP INDEX `IDX_e2c8f2d1602712387ea922c295` ON `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP INDEX `IDX_b18b74d0911b0e08ae917029f8` ON `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP TABLE `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP INDEX `IDX_be5ac77f3edc4c713a19d34d62` ON `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP INDEX `IDX_13e9d8647dadb5d352b6ba6833` ON `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP TABLE `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP INDEX `IDX_41dfcb70af895ddf9a53094515` ON `account`");
    await queryRunner.query("DROP TABLE `account`");
    await queryRunner.query("DROP TABLE `youtube_channel`");
    await queryRunner.query("DROP TABLE `youtube_video`");
    await queryRunner.query("DROP TABLE `youtube_video_category`");
    await queryRunner.query("DROP INDEX `IDX_fffdc9f21695c014eb5a479cbd` ON `youtube_tag`");
    await queryRunner.query("DROP TABLE `youtube_tag`");
    await queryRunner.query("DROP INDEX `IDX_7ad6308bb6d1645c4c7056fb20` ON `youtube_keyword`");
    await queryRunner.query("DROP TABLE `youtube_keyword`");
  }
}
