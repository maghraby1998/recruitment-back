import { IsString } from 'class-validator';
import { ReactType } from 'generated/prisma/enums';

export class CreateReactionDto {
  @IsString()
  type: ReactType;

  @IsString()
  postId: string;
}
