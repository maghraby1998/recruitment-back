import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateCompanyDto } from 'src/company/dtos/create-company.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { FileUpload } from 'graphql-upload/processRequest.mjs';
import { createWriteStream, existsSync, mkdirSync } from 'fs';

@Injectable()
export class CompanyService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  async getCompanyById(id: number) {
    const company = await this.prismaService.copmany.findUnique({
      where: { id },
      include: {
        user: true,
      },
    });

    if (company) {
      return company;
    } else {
      throw new NotFoundException('Company not found');
    }
  }

  async createCompany(input: CreateCompanyDto, image: FileUpload) {
    return this.prismaService.$transaction(async (prisma) => {
      const emailExists = await prisma.user.findFirst({
        where: { email: input.email },
      });
      if (emailExists) {
        throw new Error('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(input.password, 10);
      const user = await prisma.user.create({
        data: {
          email: input.email,
          user_type: 'COMPANY',
          password: hashedPassword,
        },
      });

      const company = await prisma.copmany.create({
        data: {
          userId: user.id,
          name: input.name,
        },
        include: {
          user: true,
        },
      });

      if (image) {
        const uploadsDir = './uploads';

        // Create uploads directory if it doesn't exist
        if (!existsSync(uploadsDir)) {
          mkdirSync(uploadsDir, { recursive: true });
        }

        const imageName = `${company.id}-${new Date().toDateString()}-${image?.filename}`;

        if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
          throw new BadRequestException('Only JPG and PNG images are allowed');
        }

        image
          ?.createReadStream()
          .pipe(createWriteStream('./uploads/' + imageName));

        await prisma.copmany.update({
          where: { id: company.id },
          data: {
            imgPath: `/uploads/${imageName}`,
          },
        });
      }

      const payload = { id: user.id, email: user.email };
      const accessToken = await this.jwtService.signAsync(payload);

      return { company, accessToken };
    });
  }

  async getCompanyByUserId(userId: number) {
    return this.prismaService.copmany.findFirst({
      where: {
        userId,
      },
    });
  }
}
