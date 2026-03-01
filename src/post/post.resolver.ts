import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';

@Resolver()
export class PostResolver {
  constructor(private postService: PostService) {}

  @Mutation()
  async createPost(@Args('input') input: CreatePostDto, @Auth() user: User) {
    return this.postService.createPost(user.id, input);
  }

  @Mutation()
  async createReact(
    @Args('input') input: CreateReactionDto,
    @Auth() user: User,
  ) {
    return this.postService.createReact(user.id, input);
  }

  @Mutation()
  async createComment(
    @Args('input') input: CreateCommentDto,
    @Auth() user: User,
  ) {
    return this.postService.createComment(user.id, input);
  }
}
