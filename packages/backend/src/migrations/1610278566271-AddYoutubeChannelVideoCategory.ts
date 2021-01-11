import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeChannelVideoCategory1610278566271 implements MigrationInterface {
  name = "AddYoutubeChannelVideoCategory1610278566271";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `YoutubeChannelVideoCategory` (`channelId` varchar(255) NOT NULL, `videoCategoryId` int NOT NULL, `num` int UNSIGNED NOT NULL DEFAULT '0', `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`channelId`, `videoCategoryId`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` ADD CONSTRAINT `FK_f28f3bd2e8f21a755aaebf9b1da` FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` ADD CONSTRAINT `FK_563ce25ff244de112c485fadc7b` FOREIGN KEY (`videoCategoryId`) REFERENCES `YoutubeVideoCategory`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` DROP FOREIGN KEY `FK_563ce25ff244de112c485fadc7b`",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` DROP FOREIGN KEY `FK_f28f3bd2e8f21a755aaebf9b1da`",
    );
    await queryRunner.query("DROP TABLE `YoutubeChannelVideoCategory`");
  }
}
