import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dtos/create-skill.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';
import OpenAI from 'openai';
import { Public } from 'src/decorators/public.decorator';

@Resolver('Skill')
export class SkillResolver {
  constructor(private skillService: SkillService) {}

  private openai = new OpenAI({
    apiKey:
      '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',
    baseURL: 'https://openrouter.ai/api/v1',
  });

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

  @Public()
  @Query()
  async generateSkills(@Args('position') position: string) {
    const prompt = `
    Generate a list of professional skills required for the position: "${position}".

    Return the response strictly as JSON in this format:
    {
      "skills": ["skill1", "skill2", "skill3"]
    }
    `;

    const response = await this.openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an HR recruitment expert.' },
        { role: 'user', content: prompt },
      ],
      temperature: 0.3,
    });

    return (
      JSON.parse(response.choices[0].message.content ?? '{}')?.skills ?? []
    );
  }
}
