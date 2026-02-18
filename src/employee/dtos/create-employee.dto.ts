import {
  IsEmail,
  IsString,
  MinLength,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
  IsOptional,
} from 'class-validator';

@ValidatorConstraint({ name: 'matchPassword', async: false })
class MatchPassword implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const obj = args.object as any;
    return value === obj.password;
  }

  defaultMessage() {
    return 'Passwords do not match';
  }
}

@ValidatorConstraint({ name: 'ValidatePosition', async: false })
class ValidatePosition implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as any;
    return obj?.positionId || obj?.positionName;
  }

  defaultMessage() {
    return 'Position is required';
  }
}

export class CreateEmployeeDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  @Validate(ValidatePosition)
  positionId: string;

  @IsString()
  @IsOptional()
  @Validate(ValidatePosition)
  positionName: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  @Validate(MatchPassword)
  confirmPassword: string;
}
