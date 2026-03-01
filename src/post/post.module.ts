import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { CommentResolver, PostResolver } from './post.resolver';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [PostService, PostResolver, CommentResolver, PrismaService, UserService],
})
export class PostModule {}
