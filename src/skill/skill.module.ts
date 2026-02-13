import { Module } from '@nestjs/common';
import { SkillService } from './skill.service';
import { SkillResolver } from './skill.resolver';

@Module({
  providers: [SkillService, SkillResolver]
})
export class SkillModule {}
