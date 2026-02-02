-- AlterTable
ALTER TABLE `job_posts` ADD COLUMN `status` ENUM('OPEN', 'CLOSED') NOT NULL DEFAULT 'OPEN';
