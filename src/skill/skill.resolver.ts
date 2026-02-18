import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dtos/create-skill.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';

@Resolver('Skill')
export class SkillResolver {
  constructor(private skillService: SkillService) {}

  @Query()
  async getMySkills(@Auth() auth: User) {
    return this.skillService.getMySkills(auth.id);
  }

  @Query()
  async skills(@Args('search') search: string) {
    return this.skillService.getAllSkills(search);
  }

  @Mutation()
  async createSkill(@Args('input') input: CreateSkillDto, @Auth() auth: User) {
    return this.skillService.createSkill(input, auth.id);
  }
}
