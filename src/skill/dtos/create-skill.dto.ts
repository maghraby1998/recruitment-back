import {
  IsOptional,
  IsString,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'validateSkill', async: false })
class ValidateSkillId implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = validationArguments?.object as any;

    const skillName = obj?.name;

    if (!skillName && !value) return false;

    return true;
  }

  defaultMessage(): string {
    return 'skill is required in case of no name';
  }
}

@ValidatorConstraint({ name: 'validateSkillName', async: false })
class ValidateSkillName implements ValidatorConstraintInterface {
  validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): Promise<boolean> | boolean {
    const obj = validationArguments?.object as any;

    const skillId = obj?.skillId;

    if (!skillId && !value) return false;

    return true;
  }

  defaultMessage(): string {
    return 'skill name is required in case of no selected skill';
  }
}

export class CreateSkillDto {
  @IsString()
  @IsOptional()
  @Validate(ValidateSkillId)
  skillId: string;

  @IsString()
  @IsOptional()
  @Validate(ValidateSkillName)
  name: string;
}
