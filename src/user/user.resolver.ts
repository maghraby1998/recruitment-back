import {
  Args,
  Context,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from './user.service';
import { Request, Response } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { User } from 'generated/prisma/client';
import { EmployeeService } from 'src/employee/employee.service';
import { CompanyService } from 'src/company/company.service';

@Resolver()
export class UserResolver {
  constructor(
    private userService: UserService,
    private employeeService: EmployeeService,
    private companyService: CompanyService,
  ) {}

  @Public()
  @Mutation()
  async signIn(
    @Args('input') input: { email: string; password: string },
    @Context() context: { res: Response },
  ) {
    const { user, accessToken } = await this.userService.signIn(
      input.email,
      input.password,
    );

    this.storeAccessTokenInCookie(context, accessToken);

    return user;
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

  @Public()
  @Mutation()
  async logOut(@Context() context: { res: Response; req: Request }) {
    context.res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
    });
    return true;
  }

  @ResolveField()
  async employee(@Parent() user: User) {
    return this.employeeService.getEmployeeByUserId(+user.id);
  }

  @ResolveField()
  async company(@Parent() user: User) {
    return this.companyService.getCompanyByUserId(+user.id);
  }
}
