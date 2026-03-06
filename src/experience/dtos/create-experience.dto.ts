import { IsDate, IsOptional, IsString } from 'class-validator';

export class CreateExperienceDto {
  @IsOptional()
  @IsString()
  positionName: string;

  @IsOptional()
  @IsString()
  positionId: string;

  @IsOptional()
  @IsString()
  companyName: string;

  @IsOptional()
  @IsString()
  companyId: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsDate()
  from: Date;

  @IsOptional()
  to: Date;
}
