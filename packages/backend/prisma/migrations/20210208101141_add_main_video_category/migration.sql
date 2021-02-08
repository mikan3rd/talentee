-- AlterTable
ALTER TABLE `YoutubeChannel` ADD COLUMN     `mainVideoCategoryId` INTEGER;

-- AddForeignKey
ALTER TABLE `YoutubeChannel` ADD FOREIGN KEY (`mainVideoCategoryId`) REFERENCES `YoutubeVideoCategory`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
