import { IsString } from 'class-validator';
import { ReactType } from 'generated/prisma/enums';

export class CreateCommentReactionDto {
  @IsString()
  reactType: ReactType;

  @IsString()
  commentId: string;
}
