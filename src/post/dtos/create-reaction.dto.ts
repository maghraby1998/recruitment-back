import { IsString } from 'class-validator';
import { ReactType } from 'generated/prisma/enums';

export class CreateReactionDto {
  @IsString()
  reactType: ReactType;

  @IsString()
  postId: string;
}
