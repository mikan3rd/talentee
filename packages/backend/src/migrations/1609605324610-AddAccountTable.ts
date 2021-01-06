import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAccountTable1609605324610 implements MigrationInterface {
  name = "AddAccountTable1609605324610";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `accounts` (`uuid` varchar(36) NOT NULL, `displayName` varchar(255) NOT NULL, `username` varchar(255) NOT NULL, `thumbnailUrl` text NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), UNIQUE INDEX `IDX_477e3187cedfb5a3ac121e899c` (`username`), PRIMARY KEY (`uuid`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP INDEX `IDX_477e3187cedfb5a3ac121e899c` ON `accounts`");
    await queryRunner.query("DROP TABLE `accounts`");
  }
}
