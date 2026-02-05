import { Module } from '@nestjs/common';
import { ApplicationResolver } from './application.resolver';
import { ApplicationService } from './application.service';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [ApplicationResolver, ApplicationService, PrismaService],
})
export class ApplicationModule {}
