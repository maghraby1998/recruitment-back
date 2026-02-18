import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Copmany, Employee } from 'generated/prisma/client';

@Injectable()
export class UserService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getAuthUser(id: number) {
    return this.prismaService.user.findFirst({
      where: {
        id,
      },
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

  async getUserByCompany(company: Copmany) {
    return this.prismaService.user.findFirst({
      where: {
        id: company.userId,
      },
    });
  }

  async getUserByEmployee(employee: Employee) {
    return this.prismaService.user.findFirst({
      where: {
        id: employee.userId,
      },
    });
  }
}
