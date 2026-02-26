import { BadRequestException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync } from 'fs';
import { FileUpload } from 'graphql-upload/processRequest.mjs';

export const storeImage = async (
  image: FileUpload,
  imageNamePrefix: string | number,
) => {
  const uploadsDir = './uploads';

  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const imageName = `${imageNamePrefix}-${new Date().toDateString()}-${image?.filename}`;

  if (!['image/jpeg', 'image/png'].includes(image.mimetype)) {
    throw new BadRequestException('Only JPG and PNG images are allowed');
  }

  image?.createReadStream().pipe(createWriteStream('./uploads/' + imageName));

  const imagePath = `/uploads/${imageName}`;
  return imagePath;
};
