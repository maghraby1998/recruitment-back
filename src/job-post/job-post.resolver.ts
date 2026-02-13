import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { JobPostService } from './job-post.service';
import { Auth } from 'src/decorators/auth.decorator';
import { JobPost, User } from 'generated/prisma/client';
import { CompanyService } from 'src/company/company.service';
import { CreateJobPostDto } from './dtos/create-job-post.dto';
import { ParseIntPipe } from '@nestjs/common';

@Resolver('JobPost')
export class JobPostResolver {
  constructor(
    private jobPostService: JobPostService,
    private companyService: CompanyService,
  ) {}

  @Query()
  async jobPosts() {
    return this.jobPostService.getJobPosts();
  }

  @Query()
  async myJobPosts(@Auth() auth: User) {
    return this.jobPostService.getMyJobPosts(Number(auth.id));
  }

  @Query()
  async jobPost(@Args('id', ParseIntPipe) id: number) {
    return this.jobPostService.getJobPost(id);
  }

  @Mutation()
  async createJobPost(
    @Args('input') input: CreateJobPostDto,
    @Auth() auth: User,
  ) {
    return this.jobPostService.createJobPost(auth.id, input);
  }

  @ResolveField()
  async company(@Parent() jobPost: JobPost) {
    return this.companyService.getCompanyById(Number(jobPost.companyId));
  }

  @ResolveField()
  async form(@Parent() jobPost: JobPost) {
    return this.jobPostService.getJobPostForm(Number(jobPost.id));
  }

  @ResolveField()
  async applicationsNumber(@Parent() jobPost: JobPost) {
    return this.jobPostService.getJobPostNumberOfApplications(jobPost.id);
  }

  @ResolveField()
  async canApply(@Parent() jobPost: JobPost, @Auth() auth: User) {
    return this.jobPostService.canApply(auth.id, jobPost.id);
  }
}
