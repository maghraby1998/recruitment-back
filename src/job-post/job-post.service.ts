import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobPostDto } from './dtos/create-job-post.dto';
import { Question } from 'generated/prisma/client';

@Injectable()
export class JobPostService {
  constructor(private prismaService: PrismaService) {}

  async getJobPost(id: number) {
    return this.prismaService.jobPost.findUnique({
      where: { id },
    });
  }

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
        companyId: company.id,
        jobPostForm: input.form
          ? {
              create: {
                requireCV: input.form.requireCV,
                questions: {
                  create:
                    input.form.questions?.map((question) => ({
                      label: question.label,
                      isRequired: question.isRequired,
                      type: question.type,
                      options: {
                        create:
                          question.options?.map((option) => ({
                            value: option.value,
                          })) || [],
                      },
                    })) || [],
                },
              },
            }
          : undefined,
      },
    });
  }

  async getJobPostForm(jobPostId: number) {
    return this.prismaService.jobPostForm.findUnique({
      where: {
        jobPostId,
      },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });
  }
}
