import { Module } from '@nestjs/common';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { PrismaService } from '../prisma.service';
import { EmployeeService } from 'src/employee/employee.service';
import { CompanyService } from 'src/company/company.service';

@Module({
  providers: [
    UserResolver,
    UserService,
    PrismaService,
    EmployeeService,
    CompanyService,
  ],
})
export class UserModule {}
