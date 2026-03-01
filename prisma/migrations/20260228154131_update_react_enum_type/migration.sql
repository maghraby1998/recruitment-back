/*
  Warnings:

  - The values [LAUGH,GREETING] on the enum `React_react_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `React` MODIFY `react_type` ENUM('LIKE', 'DISLIKE', 'LOVE', 'HAHA', 'WOW', 'CELEBRATE') NOT NULL;
