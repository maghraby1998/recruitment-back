import { IsNotEmpty, IsString } from 'class-validator';

export class QuestionOptionDto {
  @IsString()
  @IsNotEmpty()
  value: string;
}
