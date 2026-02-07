import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ApplicationAnswersDto {
  @IsString()
  @IsNotEmpty()
  questionId: string;

  @IsString()
  @IsNotEmpty()
  value: string;
}
