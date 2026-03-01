import { IsOptional, IsString } from 'class-validator';
import { PostType } from 'generated/prisma/enums';

export class CreatePostDto {
  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  type: PostType;
}
