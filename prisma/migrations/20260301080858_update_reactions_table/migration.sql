/*
  Warnings:

  - Added the required column `postId` to the `React` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `React` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `React` ADD COLUMN `postId` INTEGER NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `React` ADD CONSTRAINT `React_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `React` ADD CONSTRAINT `React_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
