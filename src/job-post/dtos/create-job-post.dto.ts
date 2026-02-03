import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateJobPostDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @MaxLength(500)
  @IsNotEmpty()
  description: string;
}
