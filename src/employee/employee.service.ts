import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEmployeeDto } from 'src/employee/dtos/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getEmployeeById(id: number) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id },
    });
    if (employee) {
      return employee;
    } else {
      throw new NotFoundException('Employee not found');
    }
  }

  async createEmployee(input: CreateEmployeeDto, image: FileUpload) {
    return this.prismaService.$transaction(async (prisma) => {
      const emailExists = await prisma.user.findFirst({
        where: { email: input.email },
      });
      if (emailExists) {
        throw new Error('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          email: input.email,
          user_type: 'EMPLOYEE',
          password: hashedPassword,
        },
      });

      const employee = await prisma.employee.create({
        data: {
          userId: user.id,
          firstName: input.firstName,
          lastName: input.lastName,
        },
        include: {
          user: true,
        },
      });

      if (input.positionName) {
        const position = await prisma.position.create({
          data: {
            title: input.positionName.toLowerCase(),
          },
        });

        await prisma.employee.update({
          where: {
            id: employee.id,
          },
          data: {
            positionId: position.id,
          },
        });
      } else {
        await prisma.employee.update({
          where: {
            id: employee.id,
          },
          data: {
            positionId: Number(input.positionId),
          },
        });
      }

      if (image) {
        const uploadsDir = './uploads';

        // Create uploads directory if it doesn't exist
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true });
        }

        const imageName = `${employee.id}-${new Date().toDateString()}-${image?.filename}`;

        if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
          throw new BadRequestException('Only JPG and PNG images are allowed');
        }

        image
          ?.createReadStream()
          .pipe(createWriteStream('./uploads/' + imageName));

        await prisma.employee.update({
          where: { id: employee.id },
          data: {
            imgPath: `/uploads/${imageName}`,
          },
        });
      }

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return { employee, accessToken };
    });
  }

  async getEmployeeByUserId(userId: number) {
    return this.prismaService.employee.findFirst({
      where: {
        userId,
      },
    });
  }

  async getEmployeePosition(employeeId: number) {
    const employee = await this.prismaService.employee.findUnique({
      where: { id: employeeId },
      select: {
        position: true,
      },
    });

    return employee?.position;
  }
}
