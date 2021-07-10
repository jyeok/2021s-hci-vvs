-- CreateTable
CREATE TABLE `Record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `path` VARCHAR(191) NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `size` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `tag` VARCHAR(191) NOT NULL DEFAULT '',
    `memo` VARCHAR(191) NOT NULL DEFAULT '',
    `isLocked` INTEGER NOT NULL DEFAULT 0,
    `voice` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Record.path_unique`(`path`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Preview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `voice` VARCHAR(191) NOT NULL,
    `recordId` INTEGER,

    UNIQUE INDEX `Preview_recordId_unique`(`recordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TextBlock` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `content` VARCHAR(191) NOT NULL,
    `isMine` INTEGER NOT NULL DEFAULT 0,
    `isHighlighted` INTEGER NOT NULL,
    `isModified` INTEGER NOT NULL,
    `reliability` DOUBLE NOT NULL,
    `start` VARCHAR(191) NOT NULL,
    `end` VARCHAR(191) NOT NULL,
    `recordId` INTEGER,
    `previewId` INTEGER,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Schedule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` VARCHAR(191) NOT NULL,
    `memo` VARCHAR(191) NOT NULL,
    `textBlockId` INTEGER,

    UNIQUE INDEX `Schedule_textBlockId_unique`(`textBlockId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TextBlock` ADD FOREIGN KEY (`recordId`) REFERENCES `Record`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `TextBlock` ADD FOREIGN KEY (`previewId`) REFERENCES `Preview`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Preview` ADD FOREIGN KEY (`recordId`) REFERENCES `Record`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Schedule` ADD FOREIGN KEY (`textBlockId`) REFERENCES `TextBlock`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
