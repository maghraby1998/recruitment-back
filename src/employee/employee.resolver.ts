import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from 'src/employee/dtos/create-employee.dto';
import { Public } from 'src/decorators/public.decorator';
import { Response } from 'express';
import { Employee } from 'generated/prisma/client';
import { UserService } from 'src/user/user.service';
import { ParseIntPipe } from '@nestjs/common';

@Resolver()
export class EmployeeResolver {
  constructor(
    private employeeService: EmployeeService,
    private userService: UserService,
  ) {}

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

  @Query()
  async employee(@Args('id', ParseIntPipe) id: number) {
    return this.employeeService.getEmployeeById(id);
  }

  @ResolveField()
  async user(@Parent() employee: Employee) {
    return this.userService.getUserByEmployee(employee);
  }
}
