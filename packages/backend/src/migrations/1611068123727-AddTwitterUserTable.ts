import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTwitterUserTable1611068123727 implements MigrationInterface {
  name = "AddTwitterUserTable1611068123727";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `TwitterUser` (`id` varchar(255) NOT NULL, `name` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `description` text NOT NULL, `profileImageUrl` text NOT NULL, `followersCount` bigint UNSIGNED NOT NULL, `followingCount` bigint UNSIGNED NOT NULL, `listedCount` bigint UNSIGNED NOT NULL, `tweetCount` bigint UNSIGNED NOT NULL, `verified` tinyint NOT NULL, `protected` tinyint NOT NULL, `createdTimestamp` datetime NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, UNIQUE INDEX `IDX_62fc451a8fc6cb0e6abeb8c6f9` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `TwitterUser` ADD CONSTRAINT `FK_bcebed04f6d4c61231f878f54ee` FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `TwitterUser` DROP FOREIGN KEY `FK_bcebed04f6d4c61231f878f54ee`");
    await queryRunner.query("DROP INDEX `IDX_62fc451a8fc6cb0e6abeb8c6f9` ON `TwitterUser`");
    await queryRunner.query("DROP TABLE `TwitterUser`");
  }
}
