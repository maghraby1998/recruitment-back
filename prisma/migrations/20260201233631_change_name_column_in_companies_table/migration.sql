/*
  Warnings:

  - You are about to drop the column `companyName` on the `company_profiles` table. All the data in the column will be lost.
  - Added the required column `name` to the `company_profiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `company_profiles` DROP COLUMN `companyName`,
    ADD COLUMN `name` VARCHAR(191) NOT NULL;
