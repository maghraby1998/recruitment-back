import { Module } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { EmployeeResolver } from './employee.resolver';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [EmployeeService, EmployeeResolver, PrismaService, UserService],
})
export class EmployeeModule {}
