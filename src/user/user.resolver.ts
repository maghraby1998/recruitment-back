import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UserService } from './user.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';

@Resolver()
export class UserResolver {
  constructor(private userService: UserService) {}

  @Mutation()
  async createEmployee(@Args('input') input: CreateEmployeeDto) {
    return this.userService.createEmployee(input);
  }
}
