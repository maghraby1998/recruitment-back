import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from 'src/employee/dtos/create-employee.dto';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';

@Resolver()
export class EmployeeResolver {
  constructor(private employeeService: EmployeeService) {}

  @Public()
  @Mutation()
  async createEmployee(
    @Args('input') input: CreateEmployeeDto,
    @Context() context: { res: Response },
  ) {
    const { employee, accessToken } =
      await this.employeeService.createEmployee(input);
    this.storeAccessTokenInCookie(context, accessToken);
    return employee;
  }

  storeAccessTokenInCookie(context: { res: Response }, accessToken: string) {
    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }
}
