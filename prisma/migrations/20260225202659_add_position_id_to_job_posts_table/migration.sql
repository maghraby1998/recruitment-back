-- AlterTable
ALTER TABLE `job_posts` ADD COLUMN `positionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `job_posts` ADD CONSTRAINT `job_posts_positionId_fkey` FOREIGN KEY (`positionId`) REFERENCES `Position`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
