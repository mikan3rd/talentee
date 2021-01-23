import { MigrationInterface, QueryRunner } from "typeorm";

export class AddInstagramUserTable1611388285260 implements MigrationInterface {
  name = "AddInstagramUserTable1611388285260";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `InstagramUser` (`id` varchar(255) NOT NULL, `fullName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `biography` text NOT NULL, `externalUrl` text NOT NULL, `profilePicUrl` text NOT NULL, `followedBy` bigint UNSIGNED NOT NULL, `follow` bigint UNSIGNED NOT NULL, `isVerified` tinyint NOT NULL, `isPrivate` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `accountId` varchar(36) NOT NULL, UNIQUE INDEX `IDX_0ee4c7a911f87e9b5cc6ecce40` (`username`), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
    await queryRunner.query(
      "ALTER TABLE `InstagramUser` ADD CONSTRAINT `FK_f8dba2deb7e6e7a71494e1db65a` FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE NO ACTION ON UPDATE CASCADE",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("ALTER TABLE `InstagramUser` DROP FOREIGN KEY `FK_f8dba2deb7e6e7a71494e1db65a`");
    await queryRunner.query("DROP INDEX `IDX_0ee4c7a911f87e9b5cc6ecce40` ON `InstagramUser`");
    await queryRunner.query("DROP TABLE `InstagramUser`");
  }
}
