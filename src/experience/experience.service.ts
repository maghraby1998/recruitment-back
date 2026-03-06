import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateExperienceDto } from './dtos/create-experience.dto';
import { Experience } from 'generated/prisma/client';

@Injectable()
export class ExperienceService {
  constructor(private prismaService: PrismaService) {}

  async createExperience(employeeId: number, input: CreateExperienceDto) {
    return this.prismaService.$transaction(async (prisma) => {
      let positionId: number;

      if (input.positionId) {
        positionId = Number(input.positionId);
      } else {
        const newPosition = await prisma.position.create({
          data: {
            title: input.positionName,
          },
        });

        positionId = newPosition.id;
      }

      return prisma.experience.create({
        data: {
          employeeId,
          from: input.from,
          to: input.to,
          positionId,
          companyId: Number(input.companyId),
          companyName: input.companyName,
          description: input.description,
        },
      });
    });
  }
}
