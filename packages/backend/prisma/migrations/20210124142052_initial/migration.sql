-- CreateTable
CREATE TABLE `Account` (
    `uuid` VARCHAR(36) NOT NULL,
    `displayName` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `thumbnailUrl` TEXT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
UNIQUE INDEX `Account.username_unique`(`username`),

    PRIMARY KEY (`uuid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeChannelKeywordRelation` (
    `channelId` VARCHAR(255) NOT NULL,
    `keywordId` INTEGER NOT NULL,
INDEX `IDX_b18b74d0911b0e08ae917029f8`(`channelId`),
INDEX `IDX_e2c8f2d1602712387ea922c295`(`keywordId`),

    PRIMARY KEY (`channelId`,`keywordId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeVideoTagRelation` (
    `videoId` VARCHAR(255) NOT NULL,
    `tagId` INTEGER NOT NULL,
INDEX `IDX_13e9d8647dadb5d352b6ba6833`(`videoId`),
INDEX `IDX_be5ac77f3edc4c713a19d34d62`(`tagId`),

    PRIMARY KEY (`videoId`,`tagId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeChannel` (
    `id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnailUrl` TEXT NOT NULL,
    `country` VARCHAR(255),
    `publishedAt` DATETIME(0) NOT NULL,
    `subscriberCount` BIGINT,
    `viewCount` BIGINT NOT NULL,
    `videoCount` BIGINT NOT NULL,
    `hiddenSubscriberCount` TINYINT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `accountId` VARCHAR(36) NOT NULL,
INDEX `FK_f81a0e842021b9f2b7346540195`(`accountId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeKeyword` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `num` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
UNIQUE INDEX `YoutubeKeyword.title_unique`(`title`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeTag` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(255) NOT NULL,
    `num` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
UNIQUE INDEX `YoutubeTag.title_unique`(`title`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeVideoCategory` (
    `id` INTEGER NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `assignable` TINYINT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeVideo` (
    `id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `thumbnailUrl` TEXT NOT NULL,
    `publishedAt` DATETIME(0) NOT NULL,
    `viewCount` BIGINT,
    `likeCount` BIGINT,
    `dislikeCount` BIGINT,
    `commentCount` BIGINT,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `videoCategoryId` INTEGER NOT NULL,
    `channelId` VARCHAR(255) NOT NULL,
INDEX `FK_1dfe47f55b7d574e2079bf8710e`(`channelId`),
INDEX `FK_e45ffb57d9965a542c4217dfcb3`(`videoCategoryId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `YoutubeChannelVideoCategory` (
    `channelId` VARCHAR(255) NOT NULL,
    `videoCategoryId` INTEGER NOT NULL,
    `num` INTEGER NOT NULL DEFAULT 0,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
INDEX `FK_563ce25ff244de112c485fadc7b`(`videoCategoryId`),

    PRIMARY KEY (`channelId`,`videoCategoryId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `TwitterUser` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `profileImageUrl` TEXT NOT NULL,
    `followersCount` BIGINT NOT NULL,
    `followingCount` BIGINT NOT NULL,
    `listedCount` BIGINT NOT NULL,
    `tweetCount` BIGINT NOT NULL,
    `verified` TINYINT NOT NULL,
    `protected` TINYINT NOT NULL,
    `createdTimestamp` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `accountId` VARCHAR(36) NOT NULL,
UNIQUE INDEX `TwitterUser.username_unique`(`username`),
INDEX `FK_bcebed04f6d4c61231f878f54ee`(`accountId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `InstagramUser` (
    `id` VARCHAR(255) NOT NULL,
    `fullName` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `biography` TEXT NOT NULL,
    `externalUrl` TEXT,
    `profilePicUrl` TEXT NOT NULL,
    `followedBy` BIGINT NOT NULL,
    `follow` BIGINT NOT NULL,
    `isVerified` TINYINT NOT NULL,
    `isPrivate` TINYINT NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `accountId` VARCHAR(36) NOT NULL,
UNIQUE INDEX `InstagramUser.username_unique`(`username`),
INDEX `FK_f8dba2deb7e6e7a71494e1db65a`(`accountId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- CreateTable
CREATE TABLE `TiktokUser` (
    `id` VARCHAR(255) NOT NULL,
    `nickname` VARCHAR(255) NOT NULL,
    `uniqueId` VARCHAR(255) NOT NULL,
    `signature` TEXT NOT NULL,
    `bioLink` TEXT,
    `avatarThumb` TEXT NOT NULL,
    `followerCount` BIGINT UNSIGNED NOT NULL,
    `followingCount` BIGINT UNSIGNED NOT NULL,
    `heartCount` BIGINT UNSIGNED NOT NULL,
    `videoCount` BIGINT UNSIGNED NOT NULL,
    `verified` TINYINT NOT NULL,
    `privateAccount` TINYINT NOT NULL,
    `secret` TINYINT NOT NULL,
    `createdTimestamp` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `accountId` VARCHAR(36) NOT NULL,
UNIQUE INDEX `TiktokUser.uniqueId_unique`(`uniqueId`),
INDEX `FK_a32497fecd2f0b0debdaf2815e0`(`accountId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- AddForeignKey
ALTER TABLE `YoutubeChannelKeywordRelation` ADD FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeChannelKeywordRelation` ADD FOREIGN KEY (`keywordId`) REFERENCES `YoutubeKeyword`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeVideoTagRelation` ADD FOREIGN KEY (`tagId`) REFERENCES `YoutubeTag`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeVideoTagRelation` ADD FOREIGN KEY (`videoId`) REFERENCES `YoutubeVideo`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeChannel` ADD FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeVideo` ADD FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeVideo` ADD FOREIGN KEY (`videoCategoryId`) REFERENCES `YoutubeVideoCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeChannelVideoCategory` ADD FOREIGN KEY (`channelId`) REFERENCES `YoutubeChannel`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `YoutubeChannelVideoCategory` ADD FOREIGN KEY (`videoCategoryId`) REFERENCES `YoutubeVideoCategory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TwitterUser` ADD FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `InstagramUser` ADD FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TiktokUser` ADD FOREIGN KEY (`accountId`) REFERENCES `Account`(`uuid`) ON DELETE CASCADE ON UPDATE CASCADE;
