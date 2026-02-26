import { IsOptional, IsString } from 'class-validator';
import { JobPostStatus } from 'generated/prisma/enums';

export class JobPostFilterDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  status: JobPostStatus;
}
