import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CompanyService } from './company.service';
import { Public } from 'src/decorators/public.decorator';
import { CreateCompanyDto } from 'src/company/dtos/create-company.dto';
import { Response } from 'express';
import { Copmany } from 'generated/prisma/client';
import { UserService } from 'src/user/user.service';
import { ParseIntPipe } from '@nestjs/common';

@Resolver()
export class CompanyResolver {
  constructor(
    private companyService: CompanyService,
    private userService: UserService,
  ) {}

  @Public()
  @Mutation()
  async createCompany(
    @Args('input') input: CreateCompanyDto,
    @Context() context: { res: Response },
  ) {
    const { company, accessToken } =
      await this.companyService.createCompany(input);
    this.storeAccessTokenInCookie(context, accessToken);
    return company;
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
  async company(@Args('id', ParseIntPipe) id: number) {
    return this.companyService.getCompanyById(id);
  }

  @ResolveField()
  async user(@Parent() company: Copmany) {
    return this.userService.getUserByCompany(company);
  }
}
