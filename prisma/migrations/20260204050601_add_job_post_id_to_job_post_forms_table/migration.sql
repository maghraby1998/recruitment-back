/*
  Warnings:

  - A unique constraint covering the columns `[jobPostId]` on the table `job_post_forms` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jobPostId` to the `job_post_forms` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `job_post_forms` ADD COLUMN `jobPostId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `job_post_forms_jobPostId_key` ON `job_post_forms`(`jobPostId`);

-- AddForeignKey
ALTER TABLE `job_post_forms` ADD CONSTRAINT `job_post_forms_jobPostId_fkey` FOREIGN KEY (`jobPostId`) REFERENCES `job_posts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
