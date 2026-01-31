import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Public()
  @Mutation()
  async createEmployee(@Args('input') input: CreateEmployeeDto) {
    return this.userService.createEmployee(input);
  }

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

    context.res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return user;
  }
}
