/*
  Warnings:

  - The values [USER] on the enum `users_user_type` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `password` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `users` ADD COLUMN `password` VARCHAR(191) NOT NULL,
    MODIFY `user_type` ENUM('EMPLOYEE', 'COMPANY') NOT NULL;
