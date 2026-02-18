import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PositionService {
  constructor(private prismaService: PrismaService) {}

  async getPositions(name: string) {
    return this.prismaService.position.findMany();
  }
}
