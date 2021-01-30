-- CreateTable
CREATE TABLE `InstagramMedia` (
    `id` VARCHAR(255) NOT NULL,
    `shortcode` VARCHAR(255) NOT NULL,
    `thumbnailSrc` TEXT NOT NULL,
    `mediaToCaption` TEXT NOT NULL,
    `displayUrl` TEXT NOT NULL,
    `isVideo` TINYINT NOT NULL,
    `likedBy` BIGINT UNSIGNED NOT NULL,
    `mediaPreviewLike` BIGINT UNSIGNED NOT NULL,
    `mediaToComment` BIGINT UNSIGNED NOT NULL,
    `videoViewCount` BIGINT UNSIGNED,
    `productType` VARCHAR(255),
    `takenAtTimestamp` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `ownerId` VARCHAR(255) NOT NULL,
    `locationId` VARCHAR(255),
UNIQUE INDEX `InstagramMedia.shortcode_unique`(`shortcode`),
INDEX `InstagramMedia.ownerId_index`(`ownerId`),
INDEX `InstagramMedia.locationId_index`(`locationId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `InstagramLocation` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `slug` VARCHAR(255) NOT NULL,
    `hasPublicPage` TINYINT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- AddForeignKey
ALTER TABLE `InstagramMedia` ADD FOREIGN KEY (`ownerId`) REFERENCES `InstagramUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstagramMedia` ADD FOREIGN KEY (`locationId`) REFERENCES `InstagramLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
