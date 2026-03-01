import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { PostService } from './post.service';
import { CreatePostDto } from './dtos/create-post.dto';
import { CreateReactionDto } from './dtos/create-reaction.dto';
import { CreateCommentDto } from './dtos/create-comment.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Comment, Post, User } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import { UserService } from 'src/user/user.service';

@Resolver('Comment')
export class CommentResolver {
  constructor(private userService: UserService) {}

  @ResolveField()
  async user(@Parent() comment: Comment) {
    return this.userService.getUserById(comment.userId);
  }
}

@Resolver('Post')
export class PostResolver {
  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {}

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

  @Query()
  async posts(pagination: PaginationDto) {
    return this.postService.getPosts(pagination);
  }

  @ResolveField()
  async user(@Parent() post: Post) {
    return this.userService.getUserById(post.userId);
  }

  @ResolveField()
  async comments(@Parent() post: Post) {
    return this.postService.getCommentsByPostId(post.id);
  }

  @ResolveField()
  async reactions(@Parent() post: Post) {
    return this.postService.getPostReactions(post.id);
  }
}
