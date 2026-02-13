import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CreateJobApplicationDto } from './dtos/create-job-application.dto';
import { ApplicationService } from './application.service';
import { Auth } from 'src/decorators/auth.decorator';
import { Application, ApplicationStatus, User } from 'generated/prisma/client';
import { JobPostService } from 'src/job-post/job-post.service';
import { EmployeeService } from 'src/employee/employee.service';
import { ParseIntPipe } from '@nestjs/common';
import { PaginationDto } from 'src/common/pagination.dto';

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
    @Args('CVFilePdf') CVFilePdf: any,
  ) {
    return this.applicationService.createJobApplication(
      Number(auth.id),
      input,
      CVFilePdf?.file,
    );
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

  @ResolveField()
  async CVFilePath(@Parent() application: Application) {
    return this.applicationService.getCVFilePdfPathWithApplicationId(
      application.id,
    );
  }

  @Query()
  async getJobPostApplications(
    @Args('jobPostId', ParseIntPipe) jobPostId: number,
    @Args('pagination') pagination?: PaginationDto,
  ) {
    return this.applicationService.getJobPostApplications(jobPostId, pagination);
  }

  @Query()
  async getMyApplications(
    @Auth() auth: User,
    @Args('pagination') pagination?: PaginationDto,
  ) {
    return this.applicationService.getMyApplications(Number(auth.id), pagination);
  }

  @Query()
  async application(@Args('id', ParseIntPipe) id: number) {
    return this.applicationService.getApplicationById(id);
  }

  @Mutation()
  async updateApplicationStatus(
    @Args('input') input: { id: number; status: ApplicationStatus },
  ) {
    return this.applicationService.updateApplicationStatus(
      Number(input.id),
      input.status,
    );
  }
}
