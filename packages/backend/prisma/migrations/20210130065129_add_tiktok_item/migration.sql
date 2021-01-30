-- CreateTable
CREATE TABLE `TiktokItem` (
    `id` VARCHAR(255) NOT NULL,
    `desc` TEXT NOT NULL,
    `commentCount` BIGINT UNSIGNED NOT NULL,
    `diggCount` BIGINT UNSIGNED NOT NULL,
    `playCount` BIGINT UNSIGNED NOT NULL,
    `shareCount` BIGINT UNSIGNED NOT NULL,
    `createdTimestamp` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `authorId` VARCHAR(255) NOT NULL,
INDEX `TiktokItem.authorId_index`(`authorId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- AddForeignKey
ALTER TABLE `TiktokItem` ADD FOREIGN KEY (`authorId`) REFERENCES `TiktokUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
