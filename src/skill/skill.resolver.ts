import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { SkillService } from './skill.service';
import { CreateSkillDto } from './dtos/create-skill.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';
import OpenAI from 'openai';
import { Public } from 'src/decorators/public.decorator';
import { ConfigService } from '@nestjs/config';

@Resolver('Skill')
export class SkillResolver {
  private openai: OpenAI;

  constructor(
    private skillService: SkillService,
    private configService: ConfigService,
  ) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('openRouterApiKey'),
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

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
