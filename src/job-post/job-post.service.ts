import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobPostDto } from './dtos/create-job-post.dto';
import { Prisma } from 'generated/prisma/client';
import { PaginationDto } from 'src/common/pagination.dto';
import {
  getPrismaPageArgs,
  buildPaginatedResult,
} from 'src/common/pagination.helper';
import { JobPostFilterDto } from './dtos/job-posts-filter.dto';

@Injectable()
export class JobPostService {
  constructor(private prismaService: PrismaService) {}

  async getJobPost(id: number) {
    return this.prismaService.jobPost.findUnique({
      where: { id },
    });
  }

  async getJobPosts(filter: JobPostFilterDto, pagination?: PaginationDto) {
    const { skip, take } = getPrismaPageArgs(pagination);

    const search = filter?.search?.toLowerCase();

    const where: Prisma.JobPostWhereInput = {
      ...(filter?.status && { status: filter?.status }),
      ...(search && {
        OR: [
          {
            position: {
              title: { contains: search },
            },
          },
          {
            skills: {
              some: {
                name: { contains: search },
              },
            },
          },
        ],
      }),
    };

    const [data, totalItems] = await Promise.all([
      this.prismaService.jobPost.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prismaService.jobPost.count({ where }),
    ]);

    return buildPaginatedResult(data, totalItems, pagination);
  }

  async getMyJobPosts(userId: number, pagination?: PaginationDto) {
    const company = await this.prismaService.copmany.findUnique({
      where: { userId },
      select: {
        id: true,
      },
    });

    const where = { companyId: company?.id };
    const { skip, take } = getPrismaPageArgs(pagination);

    const [data, totalItems] = await Promise.all([
      this.prismaService.jobPost.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
      }),
      this.prismaService.jobPost.count({ where }),
    ]);

    return buildPaginatedResult(data, totalItems, pagination);
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

    let positionId: number | undefined;
    if (input.positionId) {
      positionId = Number(input.positionId);
    } else if (input.positionName) {
      const position = await this.prismaService.position.create({
        data: { title: input.positionName },
      });
      positionId = position.id;
    }

    return this.prismaService.jobPost.create({
      data: {
        title: input.title,
        description: input.description,
        companyId: company.id,
        positionId,
        skills: {
          connect: input.skillsIds?.map((skillId) => ({
            id: Number(skillId),
          })),
          create: input.skillsNames.map((skillName) => ({
            name: skillName.toLowerCase(),
          })),
        },
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

  async getJobPostNumberOfApplications(jobPostId: number) {
    return this.prismaService.application.count({
      where: {
        jobPostId,
      },
    });
  }

  async canApply(authId: number, jobPostId: number) {
    const employee = await this.prismaService.employee.findFirst({
      where: {
        userId: authId,
      },
      select: {
        id: true,
      },
    });

    if (employee) {
      const application = await this.prismaService.application.findFirst({
        where: {
          employeeId: employee.id,
          jobPostId,
        },
      });

      return !application;
    }
  }

  async getJobPostSkills(jobPostId: number) {
    const jobPost = await this.prismaService.jobPost.findFirst({
      where: { id: jobPostId },
      select: {
        skills: true,
      },
    });

    if (!jobPost) {
      throw new NotFoundException('job post not found');
    }

    return jobPost.skills;
  }

  async getJobPostPosition(jobPostId: number) {
    const jobPost = await this.prismaService.jobPost.findFirst({
      where: {
        id: jobPostId,
      },
    });

    if (!jobPost) {
      throw new NotFoundException('job post not found');
    } else if (!jobPost.positionId) {
      return null;
    }

    const position = await this.prismaService.position.findUnique({
      where: {
        id: jobPost.positionId,
      },
    });

    if (!position) {
      throw new NotFoundException('position not found');
    }

    return position;
  }
}
