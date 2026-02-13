/*
  Warnings:

  - The values [ACCEPTED] on the enum `applications_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `applications` MODIFY `status` ENUM('PENDING', 'REJECTED', 'CANCELLED', 'IN_CONSIDERATION') NOT NULL DEFAULT 'PENDING';
