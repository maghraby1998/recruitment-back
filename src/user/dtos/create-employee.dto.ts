import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  firstName: string;
  @IsString()
  lastName: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(6)
  confirmPassword: string;
}
