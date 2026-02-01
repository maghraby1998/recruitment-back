import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEmployeeDto } from 'src/employee/dtos/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class EmployeeService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async createEmployee(input: CreateEmployeeDto) {
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
      });

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
}
