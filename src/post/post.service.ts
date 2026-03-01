import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';

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
        react_type: input.type,
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
}
