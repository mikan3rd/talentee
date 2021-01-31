-- CreateTable
CREATE TABLE `TwitterTweet` (
    `id` VARCHAR(255) NOT NULL,
    `text` TEXT NOT NULL,
    `retweetCount` BIGINT UNSIGNED NOT NULL,
    `replyCount` BIGINT UNSIGNED NOT NULL,
    `likeCount` BIGINT UNSIGNED NOT NULL,
    `quoteCount` BIGINT UNSIGNED NOT NULL,
    `possiblySensitive` TINYINT NOT NULL,
    `tweetType` VARCHAR(255),
    `createdTimestamp` DATETIME(0) NOT NULL,
    `createdAt` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
    `updatedAt` DATETIME(6) NOT NULL,
    `authorId` VARCHAR(255) NOT NULL,
INDEX `TwitterTweet.authorId_index`(`authorId`),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;

-- AddForeignKey
ALTER TABLE `TwitterTweet` ADD FOREIGN KEY (`authorId`) REFERENCES `TwitterUser`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
