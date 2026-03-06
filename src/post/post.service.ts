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
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { storeImage } from 'src/helpers/helpers';
import { CreateCommentReactionDto } from './dtos/create-comment-reaction.dto';

@Injectable()
export class PostService {
  constructor(private prismaService: PrismaService) {}

  async createPost(
    userId: number,
    input: CreatePostDto,
    images: { file: FileUpload }[],
  ) {
    console.log('images service', images);

    const post = await this.prismaService.post.create({
      data: {
        content: input.content,
        userId,
        type: input.type,
      },
    });

    let imagesToSave: any = [];

    images.forEach(async (image) => {
      const path = await storeImage(image?.file, post.id);

      imagesToSave.push({
        postId: post.id,
        path,
      });
    });

    await this.prismaService.postImage.createMany({
      data: imagesToSave,
    });

    return post;
  }

  async createReact(userId: number, input: CreateReactionDto) {
    await this.prismaService.react.deleteMany({
      where: {
        postId: Number(input.postId),
        userId,
      },
    });

    return this.prismaService.react.create({
      data: {
        postId: Number(input.postId),
        userId,
        react_type: input.reactType,
      },
    });
  }

  async createCommentReaction(userId: number, input: CreateCommentReactionDto) {
    await this.prismaService.commentReact.deleteMany({
      where: {
        commentId: Number(input.commentId),
        userId,
      },
    });

    return this.prismaService.commentReact.create({
      data: {
        commentId: Number(input.commentId),
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
        parentId: Number(input.parentId),
      },
    });
  }

  async getPosts(pagination: PaginationDto) {
    const { skip, take } = getPrismaPageArgs(pagination);
    const posts = await this.prismaService.post.findMany({
      skip,
      take,
      orderBy: {
        created_at: 'desc',
      },
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

  async getCommentReactions(commentId: number) {
    return [
      ReactType.LIKE,
      ReactType.DISLIKE,
      ReactType.HAHA,
      ReactType.LOVE,
      ReactType.WOW,
      ReactType.CELEBRATE,
    ].map(async (type) => {
      return {
        count: await this.prismaService.commentReact.count({
          where: {
            react_type: type,
            commentId,
          },
        }),
        type,
      };
    });
  }

  async getAuthReactionOnPost(userId: number, postId: number) {
    const reaction = await this.prismaService.react.findFirst({
      where: {
        postId,
        userId,
      },
      select: {
        react_type: true,
      },
    });

    if (reaction) {
      return reaction.react_type;
    } else {
      return null;
    }
  }

  async getAuthReactionOnComment(userId: number, commentId: number) {
    const reaction = await this.prismaService.commentReact.findFirst({
      where: {
        commentId,
        userId,
      },
      select: {
        react_type: true,
      },
    });

    if (reaction) {
      return reaction.react_type;
    } else {
      return null;
    }
  }

  async deleteReaction(userId: number, postId: number) {
    const reaction = await this.prismaService.react.findFirst({
      where: {
        postId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (reaction) {
      return this.prismaService.react.delete({
        where: {
          id: reaction.id,
        },
      });
    } else {
      return null;
    }
  }

  async deleteCommentReaction(userId: number, commentId: number) {
    const reaction = await this.prismaService.commentReact.findFirst({
      where: {
        commentId,
        userId,
      },
      select: {
        id: true,
      },
    });

    if (reaction) {
      return this.prismaService.react.delete({
        where: {
          id: reaction.id,
        },
      });
    } else {
      return null;
    }
  }

  async getPostImages(postId: number) {
    const paths = await this.prismaService.postImage.findMany({
      where: {
        postId,
      },
      select: {
        path: true,
      },
    });

    return paths.map((path) => path.path);
  }
}
