import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ApplicationAnswersDto } from './application-answers.dto';

export class CreateJobApplicationDto {
  @IsString()
  @IsNotEmpty()
  jobPostId: string;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ApplicationAnswersDto)
  answers: ApplicationAnswersDto[];
}
