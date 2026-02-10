import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobApplicationDto } from './dtos/create-job-application.dto';
import { EmployeeService } from 'src/employee/employee.service';

@Injectable()
export class ApplicationService {
  constructor(
    private prismaService: PrismaService,
    private employeeService: EmployeeService,
  ) {}

  async getApplicationById(id: number) {
    return this.prismaService.application.findUnique({
      where: {
        id: id,
      },
    });
  }

  async createJobApplication(userId: number, input: CreateJobApplicationDto) {
    const employee = await this.employeeService.getEmployeeByUserId(userId);

    if (!employee) {
      throw new NotFoundException('user is not found');
    }
    const jobPostForm = await this.prismaService.jobPostForm.findUnique({
      where: {
        jobPostId: Number(input.jobPostId),
      },
      select: {
        id: true,
      },
    });

    return this.prismaService.application.create({
      data: {
        employeeId: employee?.id,
        jobPostId: Number(input.jobPostId),
        ...(!!jobPostForm
          ? {
              jobPostFormAnswers: {
                create: {
                  jobPostFormId: jobPostForm?.id,
                  answers: {
                    create: input.answers?.map((answer) => ({
                      questionId: Number(answer.questionId),
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

  async getAnswersByApplicationId(applicationId: number) {
    const formAnswersObj =
      await this.prismaService.jobPostFormAnswers.findFirst({
        where: {
          applicationId,
        },
      });

    return this.prismaService.answer.findMany({
      where: {
        jobPostFormAnswersId: formAnswersObj?.id,
      },
    });
  }

  async getJobPostApplications(jobPostId) {
    return this.prismaService.application.findMany({
      where: {
        jobPostId,
      },
    });
  }

  async getMyApplications(authId: number) {
    return this.prismaService.application.findMany({
      where: {
        employeeId: authId,
      },
    });
  }
}
