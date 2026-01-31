import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateEmployeeDto } from './dtos/create-employee.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
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

      return employee;
    });
  }

  async signIn(email: string, pass: string) {
    const user = await this.prismaService.user.findFirst({
      where: { email },
    });
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);

    return { user, accessToken };
  }
}
