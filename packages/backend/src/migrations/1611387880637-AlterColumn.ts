import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterColumn1611387880637 implements MigrationInterface {
  name = "AlterColumn1611387880637";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `YoutubeTag` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideo` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoCategory` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeKeyword` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannel` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `Account` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "ALTER TABLE `Account` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannel` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeKeyword` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeChannelVideoCategory` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideoCategory` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeVideo` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
    await queryRunner.query(
      "ALTER TABLE `YoutubeTag` CHANGE `updatedAt` `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)",
    );
  }
}
