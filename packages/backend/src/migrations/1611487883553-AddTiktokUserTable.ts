import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTiktokUserTable1611487883553 implements MigrationInterface {
  name = "AddTiktokUserTable1611487883553";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `TiktokUser` (`id` varchar(255) NOT NULL, `nickname` varchar(255) NOT NULL, `uniqueId` varchar(255) NOT NULL, `signature` text NOT NULL, `bioLink` text NULL, `avatarThumb` text NOT NULL, `followerCount` bigint UNSIGNED NOT NULL, `followingCount` bigint UNSIGNED NOT NULL, `heartCount` bigint UNSIGNED NOT NULL, `videoCount` bigint UNSIGNED NOT NULL, `verified` tinyint NOT NULL, `privateAccount` tinyint NOT NULL, `secret` tinyint NOT NULL, `createdTimestamp` datetime NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, UNIQUE INDEX `IDX_6e16da688faede9a1711a70dcb` (`uniqueId`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `TiktokUser` ADD CONSTRAINT `FK_a32497fecd2f0b0debdaf2815e0` FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `TiktokUser` DROP FOREIGN KEY `FK_a32497fecd2f0b0debdaf2815e0`");
    await queryRunner.query("DROP INDEX `IDX_6e16da688faede9a1711a70dcb` ON `TiktokUser`");
    await queryRunner.query("DROP TABLE `TiktokUser`");
  }
}
