import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { JobPostFormDto } from './job-post-form.dto';

export class CreateJobPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => JobPostFormDto)
  form?: JobPostFormDto;
}
