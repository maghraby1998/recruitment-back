import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  content: string;

  @IsString()
  postId: string;

  @IsString()
  @IsOptional()
  parentId: string;
}
