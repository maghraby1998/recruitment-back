import { Module } from '@nestjs/common';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { PrismaService } from 'src/prisma.service';
import { JobPostService } from 'src/job-post/job-post.service';
import { EmployeeService } from 'src/employee/employee.service';

@Module({
  providers: [
    ApplicationResolver,
    ApplicationService,
    PrismaService,
    JobPostService,
    EmployeeService,
  ],
})
export class ApplicationModule {}
