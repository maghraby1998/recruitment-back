import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCompanyDto } from 'src/company/dtos/create-company.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class CompanyService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getCompanyById(id: number) {
    const company = await this.prismaService.copmany.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (company) {
      return company;
    } else {
      throw new NotFoundException('Company not found');
    }
  }

  async createCompany(input: CreateCompanyDto) {
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
          user_type: 'COMPANY',
          password: hashedPassword,
        },
      });

      const company = await prisma.copmany.create({
        data: {
          userId: user.id,
          name: input.name,
        },
        include: {
          user: true,
        },
      });

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return { company, accessToken };
    });
  }

  async getCompanyByUserId(userId: number) {
    return this.prismaService.copmany.findFirst({
      where: {
        userId,
      },
    });
  }
}
