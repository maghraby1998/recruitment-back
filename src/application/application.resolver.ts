import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateJobApplicationDto } from './dtos/create-job-application.dto';
import { ApplicationService } from './application.service';
import { Auth } from 'src/decorators/auth.decorator';
import { Application, User } from 'generated/prisma/client';
import { JobPostService } from 'src/job-post/job-post.service';
import { EmployeeService } from 'src/employee/employee.service';

@Resolver('Application')
export class ApplicationResolver {
  constructor(
    private applicationService: ApplicationService,
    private jobPostService: JobPostService,
    private employeeService: EmployeeService,
  ) {}
  @Mutation()
  async applyForJob(
    @Args('input') input: CreateJobApplicationDto,
    @Auth() auth: User,
  ) {
    return this.applicationService.createJobApplication(Number(auth.id), input);
  }

  @ResolveField()
  async jobPost(@Parent() application: Application) {
    return this.jobPostService.getJobPost(application.jobPostId);
  }

  @ResolveField()
  async employee(@Parent() application: Application) {
    return this.employeeService.getEmployeeById(application.employeeId);
  }

  @ResolveField()
  async answers(@Parent() application: Application) {
    return this.applicationService.getAnswersByApplicationId(
      Number(application.id),
    );
  }
}
