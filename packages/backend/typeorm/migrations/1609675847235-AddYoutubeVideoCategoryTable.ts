import { MigrationInterface, QueryRunner } from "typeorm";

export class AddYoutubeVideoCategoryTable1609675847235 implements MigrationInterface {
  name = "AddYoutubeVideoCategoryTable1609675847235";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "CREATE TABLE `youtubeVideoCategories` (`id` int NOT NULL, `title` varchar(255) NOT NULL, `assignable` tinyint NOT NULL, `createdAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updatedAt` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`id`)) ENGINE=InnoDB",
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("DROP TABLE `youtubeVideoCategories`");
  }
}
