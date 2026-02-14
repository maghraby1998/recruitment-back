import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [SkillService, SkillResolver, PrismaService],
})
export class SkillModule {}
