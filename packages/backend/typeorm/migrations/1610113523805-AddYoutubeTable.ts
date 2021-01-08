import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeTable1610113523805 implements MigrationInterface {
  name = "AddYoutubeTable1610113523805";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `YoutubeKeyword` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_8bf8bd0418516b8dbf354cbb6d` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeTag` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_0300dfb22f01f9f0e3d2a10453` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeVideoCategory` (`id` int NOT NULL, `title` varchar(255) NOT NULL, `assignable` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeVideo` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `publishedAt` datetime NOT NULL, `viewCount` bigint UNSIGNED NOT NULL, `likeCount` bigint UNSIGNED NULL DEFAULT NULL, `dislikeCount` bigint UNSIGNED NULL DEFAULT NULL, `commentCount` bigint UNSIGNED NULL DEFAULT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `videoCategoryId` int NOT NULL, `channelId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeChannel` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `country` varchar(255) NOT NULL, `publishedAt` datetime NOT NULL, `subscriberCount` bigint UNSIGNED NULL DEFAULT NULL, `viewCount` bigint UNSIGNED NOT NULL, `videoCount` bigint UNSIGNED NOT NULL, `hiddenSubscriberCount` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `Account` (`uuid` varchar(36) NOT NULL, `displayName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `thumbnailUrl` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_c8782447aa50983c50fa634d9c` (`username`), PRIMARY KEY (`uuid`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeVideoTagRelation` (`videoId` varchar(255) NOT NULL, `tagId` int NOT NULL, INDEX `IDX_13e9d8647dadb5d352b6ba6833` (`videoId`), INDEX `IDX_be5ac77f3edc4c713a19d34d62` (`tagId`), PRIMARY KEY (`videoId`, `tagId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `YoutubeChannelKeywordRelation` (`channelId` varchar(255) NOT NULL, `keywordId` int NOT NULL, INDEX `IDX_b18b74d0911b0e08ae917029f8` (`channelId`), INDEX `IDX_e2c8f2d1602712387ea922c295` (`keywordId`), PRIMARY KEY (`channelId`, `keywordId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideo` ADD CONSTRAINT `FK_e45ffb57d9965a542c4217dfcb3` FOREIGN KEY (`videoCategoryId`) REFERENCES `YoutubeVideoCategory`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideo` ADD CONSTRAINT `FK_1dfe47f55b7d574e2079bf8710e` FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannel` ADD CONSTRAINT `FK_f81a0e842021b9f2b7346540195` FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoTagRelation` ADD CONSTRAINT `FK_13e9d8647dadb5d352b6ba6833b` FOREIGN KEY (`videoId`) REFERENCES `YoutubeVideo`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoTagRelation` ADD CONSTRAINT `FK_be5ac77f3edc4c713a19d34d620` FOREIGN KEY (`tagId`) REFERENCES `YoutubeTag`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` ADD CONSTRAINT `FK_b18b74d0911b0e08ae917029f81` FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelKeywordRelation` ADD CONSTRAINT `FK_e2c8f2d1602712387ea922c295a` FOREIGN KEY (`keywordId`) REFERENCES `YoutubeKeyword`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
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
    await queryRunner.query("ALTER TABLE `YoutubeChannel` DROP FOREIGN KEY `FK_f81a0e842021b9f2b7346540195`");
    await queryRunner.query("ALTER TABLE `YoutubeVideo` DROP FOREIGN KEY `FK_1dfe47f55b7d574e2079bf8710e`");
    await queryRunner.query("ALTER TABLE `YoutubeVideo` DROP FOREIGN KEY `FK_e45ffb57d9965a542c4217dfcb3`");
    await queryRunner.query("DROP INDEX `IDX_e2c8f2d1602712387ea922c295` ON `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP INDEX `IDX_b18b74d0911b0e08ae917029f8` ON `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP TABLE `YoutubeChannelKeywordRelation`");
    await queryRunner.query("DROP INDEX `IDX_be5ac77f3edc4c713a19d34d62` ON `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP INDEX `IDX_13e9d8647dadb5d352b6ba6833` ON `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP TABLE `YoutubeVideoTagRelation`");
    await queryRunner.query("DROP INDEX `IDX_c8782447aa50983c50fa634d9c` ON `Account`");
    await queryRunner.query("DROP TABLE `Account`");
    await queryRunner.query("DROP TABLE `YoutubeChannel`");
    await queryRunner.query("DROP TABLE `YoutubeVideo`");
    await queryRunner.query("DROP TABLE `YoutubeVideoCategory`");
    await queryRunner.query("DROP INDEX `IDX_0300dfb22f01f9f0e3d2a10453` ON `YoutubeTag`");
    await queryRunner.query("DROP TABLE `YoutubeTag`");
    await queryRunner.query("DROP INDEX `IDX_8bf8bd0418516b8dbf354cbb6d` ON `YoutubeKeyword`");
    await queryRunner.query("DROP TABLE `YoutubeKeyword`");
  }
}
