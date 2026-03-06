import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ExperienceService } from './experience.service';
import { CreateExperienceDto } from './dtos/create-experience.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { Experience, User } from 'generated/prisma/client';
import { CompanyService } from 'src/company/company.service';
import { PositionService } from 'src/position/position.service';

@Resolver('Experience')
export class ExperienceResolver {
  constructor(
    private experienceService: ExperienceService,
    private companyService: CompanyService,
    private positionService: PositionService,
  ) {}

  @Mutation()
  async createExperience(
    @Auth() auth: User,
    @Args('input') input: CreateExperienceDto,
  ) {
    return this.experienceService.createExperience(auth.id, input);
  }

  @ResolveField()
  async company(@Parent() experience: Experience) {
    return this.companyService.getCompany(experience.companyId);
  }

  @ResolveField()
  async position(@Parent() experience: Experience) {
    return this.positionService.getPositionById(experience.positionId);
  }
}
