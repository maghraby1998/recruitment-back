import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { QuestionOptionDto } from './question-option.dto';

export enum QuestionType {
  TEXT = 'TEXT',
  TEXTAREA = 'TEXTAREA',
  RADIO = 'RADIO',
}

export class QuestionDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsBoolean()
  isRequired: boolean;

  @IsEnum(QuestionType)
  @IsNotEmpty()
  type: QuestionType;

  // Options are required only for RADIO type questions
  @ValidateIf((o) => o.type === QuestionType.RADIO)
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOptionDto)
  @IsNotEmpty()
  options?: QuestionOptionDto[];
}
