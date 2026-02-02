import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyResolver } from './company.resolver';
import { PrismaService } from 'src/prisma.service';
import { UserService } from 'src/user/user.service';

@Module({
  providers: [CompanyService, CompanyResolver, PrismaService, UserService],
})
export class CompanyModule {}
