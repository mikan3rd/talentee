import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeChannelRelation1609691310040 implements MigrationInterface {
  name = "AddYoutubeChannelRelation1609691310040";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeChannels` ADD `accountId` varchar(36) NOT NULL");
    await queryRunner.query(
      "ALTER TABLE `youtubeChannels` ADD CONSTRAINT `FK_c6ae27acf3bf4ab1d0dd04480db` FOREIGN KEY (`accountId`) REFERENCES `accounts`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP FOREIGN KEY `FK_c6ae27acf3bf4ab1d0dd04480db`");
    await queryRunner.query("ALTER TABLE `youtubeChannels` DROP COLUMN `accountId`");
  }
}
