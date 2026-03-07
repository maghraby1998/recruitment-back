import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { CommentResolver, PostResolver } from './post.resolver';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';
import { PubSub } from 'graphql-subscriptions';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [NotificationModule],
  providers: [
    PostService,
    PostResolver,
    CommentResolver,
    PrismaService,
    UserService,
    PubSub,
  ],
})
export class PostModule {}
