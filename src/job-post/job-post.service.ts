import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobPostDto } from './dtos/create-job-post.dto';

@Injectable()
export class JobPostService {
  constructor(private prismaService: PrismaService) {}

  async getJobPosts() {
    return this.prismaService.jobPost.findMany();
  }

  async getMyJobPosts(userId: number) {
    const company = await this.prismaService.copmany.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    return this.prismaService.jobPost.findMany({
      where: {
        companyId: company?.id,
      },
    });
  }

  async createJobPost(userId: number, input: CreateJobPostDto) {
    const company = await this.prismaService.copmany.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    if (!company) {
      throw new NotFoundException('company not found');
    }

    return this.prismaService.jobPost.create({
      data: {
        title: input.title,
        description: input.description,
        companyId: company?.id,
      },
    });
  }
}
