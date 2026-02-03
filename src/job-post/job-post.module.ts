import { Module } from '@nestjs/common';
import { JobPostResolver } from './job-post.resolver';
import { JobPostService } from './job-post.service';
import { PrismaService } from 'src/prisma.service';
import { CompanyService } from 'src/company/company.service';

@Module({
  providers: [JobPostResolver, JobPostService, PrismaService, CompanyService],
})
export class JobPostModule {}
