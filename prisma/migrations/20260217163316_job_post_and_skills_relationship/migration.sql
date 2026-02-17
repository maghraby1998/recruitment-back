-- CreateTable
CREATE TABLE `_JobPostToSkill` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_JobPostToSkill_AB_unique`(`A`, `B`),
    INDEX `_JobPostToSkill_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_JobPostToSkill` ADD CONSTRAINT `_JobPostToSkill_A_fkey` FOREIGN KEY (`A`) REFERENCES `job_posts`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_JobPostToSkill` ADD CONSTRAINT `_JobPostToSkill_B_fkey` FOREIGN KEY (`B`) REFERENCES `Skill`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
