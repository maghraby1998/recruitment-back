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

  async createJobApplication(userId: number, input: CreateJobApplicationDto) {
    const employee = await this.employeeService.getEmployeeByUserId(userId);

    if (!employee) {
      throw new NotFoundException('user is not found');
    }
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
        employeeId: employee?.id,
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
}
