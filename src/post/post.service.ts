import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import {
  buildPaginatedResult,
  getPrismaPageArgs,
} from 'src/common/pagination.helper';
import { Post, ReactType } from 'generated/prisma/client';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPost(userId: number, input: CreatePostDto) {
    return this.prismaService.post.create({
      data: {
        content: input.content,
        userId,
      },
    });
  }

  async createReact(userId: number, input: CreateReactionDto) {
    return this.prismaService.react.create({
      data: {
        postId: Number(input.postId),
        userId,
        react_type: input.reactType,
      },
    });
  }

  async createComment(userId: number, input: CreateCommentDto) {
    return this.prismaService.comment.create({
      data: {
        userId,
        postId: Number(input.postId),
        content: input.content,
      },
    });
  }

  async getPosts(pagination: PaginationDto) {
    const { skip, take } = getPrismaPageArgs(pagination);
    const posts = await this.prismaService.post.findMany({
      skip,
      take,
    });

    const totalPosts = await this.prismaService.post.count();

    return buildPaginatedResult<Post>(posts, totalPosts, pagination);
  }

  async getCommentsByPostId(postId: number) {
    return this.prismaService.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async getPostReactions(postId: number) {
    return [
      ReactType.LIKE,
      ReactType.DISLIKE,
      ReactType.HAHA,
      ReactType.LOVE,
      ReactType.WOW,
      ReactType.CELEBRATE,
    ].map(async (type) => {
      return {
        count: await this.prismaService.react.count({
          where: {
            react_type: type,
            postId,
          },
        }),
        type,
      };
    });
  }
}
