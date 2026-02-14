import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dtos/create-skill.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';

@Resolver()
export class SkillResolver {
  constructor(private skillService: SkillService) {}

  @Mutation()
  async createSkill(@Args('input') input: CreateSkillDto, @Auth() auth: User) {
    return this.skillService.createSkill(input, auth.id);
  }
}
