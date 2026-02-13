import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateJobApplicationDto } from './dtos/create-job-application.dto';
import { EmployeeService } from 'src/employee/employee.service';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { unlink } from 'fs/promises';
import { ApplicationStatus } from 'generated/prisma/enums';

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

  async createJobApplication(
    userId: number,
    input: CreateJobApplicationDto,
    CVFilePdf: FileUpload,
  ) {
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

    let pdfName: string | undefined;

    if (CVFilePdf) {
      const uploadsDir = './uploads';

      if (!existsSync(uploadsDir)) {
        mkdirSync(uploadsDir, { recursive: true });
      }

      pdfName = `${employee.id}-${new Date().toDateString()}-${CVFilePdf?.filename}`;

      if (!['application/pdf'].includes(CVFilePdf.mimetype)) {
        throw new BadRequestException('Only PDF files are allowed');
      }

      CVFilePdf?.createReadStream().pipe(
        createWriteStream('./uploads/' + pdfName),
      );
    }

    try {
      const application = await this.prismaService.application.create({
        data: {
          employeeId: employee?.id,
          jobPostId: Number(input.jobPostId),
          ...(!!jobPostForm
            ? {
                jobPostFormAnswers: {
                  create: {
                    jobPostFormId: jobPostForm?.id,
                    CVFilePath: `/uploads/${pdfName}`,
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

      return application;
    } catch (err) {
      if (pdfName) {
        await unlink(`/uploads/${pdfName}`);
        throw err;
      }
    }
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

  async getCVFilePdfPathWithApplicationId(id: number) {
    const jobPostFormAnswers =
      await this.prismaService.jobPostFormAnswers.findFirst({
        where: {
          applicationId: id,
        },
      });

    return jobPostFormAnswers?.CVFilePath;
  }

  async updateApplicationStatus(id: number, status: ApplicationStatus) {
    return this.prismaService.application.update({
      where: { id },
      data: {
        status,
      },
    });
  }
}
