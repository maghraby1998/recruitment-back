import { Args, Query, Resolver } from '@nestjs/graphql';
import { PositionService } from './position.service';
import { Public } from 'src/decorators/public.decorator';

@Resolver('Position')
export class PositionResolver {
  constructor(private positionService: PositionService) {}

  @Public()
  @Query()
  async positions(@Args('name') name: string) {
    return this.positionService.getPositions(name);
  }
}
