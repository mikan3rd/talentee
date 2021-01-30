/*
  Warnings:

  - You are about to alter the column `followedBy` on the `InstagramUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `follow` on the `InstagramUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `followersCount` on the `TwitterUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `followingCount` on the `TwitterUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `listedCount` on the `TwitterUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `tweetCount` on the `TwitterUser` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `subscriberCount` on the `YoutubeChannel` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `viewCount` on the `YoutubeChannel` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `videoCount` on the `YoutubeChannel` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `viewCount` on the `YoutubeVideo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `likeCount` on the `YoutubeVideo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `dislikeCount` on the `YoutubeVideo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.
  - You are about to alter the column `commentCount` on the `YoutubeVideo` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `UnsignedBigInt`.

*/
-- AlterTable
ALTER TABLE `InstagramUser` MODIFY `followedBy` BIGINT UNSIGNED NOT NULL,
    MODIFY `follow` BIGINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `TwitterUser` MODIFY `followersCount` BIGINT UNSIGNED NOT NULL,
    MODIFY `followingCount` BIGINT UNSIGNED NOT NULL,
    MODIFY `listedCount` BIGINT UNSIGNED NOT NULL,
    MODIFY `tweetCount` BIGINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `YoutubeChannel` MODIFY `subscriberCount` BIGINT UNSIGNED,
    MODIFY `viewCount` BIGINT UNSIGNED NOT NULL,
    MODIFY `videoCount` BIGINT UNSIGNED NOT NULL;

-- AlterTable
ALTER TABLE `YoutubeVideo` MODIFY `viewCount` BIGINT UNSIGNED,
    MODIFY `likeCount` BIGINT UNSIGNED,
    MODIFY `dislikeCount` BIGINT UNSIGNED,
    MODIFY `commentCount` BIGINT UNSIGNED;
