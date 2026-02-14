import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateSkillDto } from './dtos/create-skill.dto';

@Injectable()
export class SkillService {
  constructor(private prismaService: PrismaService) {}

  async createSkill(input: CreateSkillDto, authId: number) {
    const employee = await this.prismaService.employee.findFirst({
      where: {
        userId: authId,
      },
      select: {
        id: true,
      },
    });
    if (input.name) {
      const skill = await this.prismaService.skill.create({
        data: {
          name: input.name,
        },
      });

      await this.prismaService.employee.update({
        where: {
          id: employee?.id,
        },
        data: {
          skills: {
            connect: {
              id: skill.id,
            },
          },
        },
      });

      return skill;
    } else {
      const skill = await this.prismaService.skill.findFirst({
        where: {
          id: Number(input.skillId),
        },
        select: {
          id: true,
        },
      });
      await this.prismaService.employee.update({
        where: {
          id: employee?.id,
        },
        data: {
          skills: {
            connect: {
              id: skill?.id,
            },
          },
        },
      });

      return skill;
    }
  }
}
