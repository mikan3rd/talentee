-- CreateTable
CREATE TABLE `User` (
    `uid` VARCHAR(255) NOT NULL,
    `role` ENUM('NONE', 'ADMIN') NOT NULL DEFAULT 'NONE',
    `name` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`uid`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin;
