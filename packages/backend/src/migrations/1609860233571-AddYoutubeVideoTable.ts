import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeVideoTable1609860233571 implements MigrationInterface {
  name = "AddYoutubeVideoTable1609860233571";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `youtubeTags` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(255) NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_159806b25391307f5165cce5d6` (`title`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtubeVideos` (`id` varchar(255) NOT NULL, `title` varchar(255) NOT NULL, `description` text NOT NULL, `thumbnailUrl` text NOT NULL, `publishedAt` datetime NOT NULL, `viewCount` bigint UNSIGNED NOT NULL, `likeCount` bigint UNSIGNED NOT NULL, `dislikeCount` bigint UNSIGNED NOT NULL, `commentCount` bigint UNSIGNED NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `videoCategoryId` int NOT NULL, `channelId` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "CREATE TABLE `youtube_videos_tags` (`video_id` varchar(255) NOT NULL, `tag_id` int NOT NULL, INDEX `IDX_beaad95f284f426e23c4f2a457` (`video_id`), INDEX `IDX_69e4109d8b91ace4984014783d` (`tag_id`), PRIMARY KEY (`video_id`, `tag_id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `youtubeChannels` CHANGE `subscriberCount` `subscriberCount` bigint UNSIGNED NULL DEFAULT NULL",
    );
    await queryRunner.query(
      "ALTER TABLE `youtubeVideos` ADD CONSTRAINT `FK_cf836d2aa8585ef730366e3f01a` FOREIGN KEY (`videoCategoryId`) REFERENCES `youtubeVideoCategories`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `youtubeVideos` ADD CONSTRAINT `FK_9fcdb53c5c16b6cade2b22fa506` FOREIGN KEY (`channelId`) REFERENCES `youtubeChannels`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_videos_tags` ADD CONSTRAINT `FK_beaad95f284f426e23c4f2a457b` FOREIGN KEY (`video_id`) REFERENCES `youtubeVideos`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
    await queryRunner.query(
      "ALTER TABLE `youtube_videos_tags` ADD CONSTRAINT `FK_69e4109d8b91ace4984014783d9` FOREIGN KEY (`tag_id`) REFERENCES `youtubeTags`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtube_videos_tags` DROP FOREIGN KEY `FK_69e4109d8b91ace4984014783d9`");
    await queryRunner.query("ALTER TABLE `youtube_videos_tags` DROP FOREIGN KEY `FK_beaad95f284f426e23c4f2a457b`");
    await queryRunner.query("ALTER TABLE `youtubeVideos` DROP FOREIGN KEY `FK_9fcdb53c5c16b6cade2b22fa506`");
    await queryRunner.query("ALTER TABLE `youtubeVideos` DROP FOREIGN KEY `FK_cf836d2aa8585ef730366e3f01a`");
    await queryRunner.query(
      "ALTER TABLE `youtubeChannels` CHANGE `subscriberCount` `subscriberCount` bigint UNSIGNED NULL",
    );
    await queryRunner.query("DROP INDEX `IDX_69e4109d8b91ace4984014783d` ON `youtube_videos_tags`");
    await queryRunner.query("DROP INDEX `IDX_beaad95f284f426e23c4f2a457` ON `youtube_videos_tags`");
    await queryRunner.query("DROP TABLE `youtube_videos_tags`");
    await queryRunner.query("DROP TABLE `youtubeVideos`");
    await queryRunner.query("DROP INDEX `IDX_159806b25391307f5165cce5d6` ON `youtubeTags`");
    await queryRunner.query("DROP TABLE `youtubeTags`");
  }
}
