import { Module } from '@nestjs/common';
import { PositionService } from './position.service';
import { PositionResolver } from './position.resolver';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [PositionService, PositionResolver, PrismaService],
})
export class PositionModule {}
