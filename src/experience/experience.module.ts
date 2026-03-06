import { Module } from '@nestjs/common';
import { ExperienceService } from './experience.service';
import { ExperienceResolver } from './experience.resolver';
import { PrismaService } from 'src/prisma.service';
import { CompanyService } from 'src/company/company.service';
import { PositionService } from 'src/position/position.service';

@Module({
  providers: [
    ExperienceService,
    ExperienceResolver,
    PrismaService,
    CompanyService,
    PositionService,
  ],
})
export class ExperienceModule {}
