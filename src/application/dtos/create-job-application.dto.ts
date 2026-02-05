import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { ApplicationAnswersDto } from './application-answers.dto';

export class CreateJobApplicationDto {
  @IsNumber()
  @IsNotEmpty()
  jobPostId: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ApplicationAnswersDto)
  answers: ApplicationAnswersDto[];
}
