import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ApplicationAnswersDto {
  @IsNumber()
  @IsNotEmpty()
  questionId: number;

  @IsString()
  @IsNotEmpty()
  value: string;
}
