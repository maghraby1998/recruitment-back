import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobApplicationDto } from './dtos/create-job-application.dto';

@Injectable()
export class ApplicationService {
  constructor(private prismaService: PrismaService) {}

  async createJobApplication(
    employeeId: number,
    input: CreateJobApplicationDto,
  ) {
    const jobPostForm = await this.prismaService.jobPostForm.findUnique({
      where: {
        jobPostId: input.jobPostId,
      },
      select: {
        id: true,
      },
    });

    return this.prismaService.application.create({
      data: {
        employeeId,
        jobPostId: input.jobPostId,
        ...(!!jobPostForm
          ? {
              jobPostFormAnswers: {
                create: {
                  jobPostFormId: jobPostForm?.id,
                  answers: {
                    create: input.answers?.map((answer) => ({
                      questionId: answer.questionId,
                      value: answer.value,
                    })),
                  },
                },
              },
            }
          : {}),
      },
    });
  }
}
