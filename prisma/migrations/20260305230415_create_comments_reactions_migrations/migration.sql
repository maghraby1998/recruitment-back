-- CreateTable
CREATE TABLE `CommentReact` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `react_type` ENUM('LIKE', 'DISLIKE', 'LOVE', 'HAHA', 'WOW', 'CELEBRATE') NOT NULL,
    `userId` INTEGER NOT NULL,
    `commentId` INTEGER NOT NULL,
    `created_at` TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `CommentReact` ADD CONSTRAINT `CommentReact_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `CommentReact` ADD CONSTRAINT `CommentReact_commentId_fkey` FOREIGN KEY (`commentId`) REFERENCES `Comment`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
