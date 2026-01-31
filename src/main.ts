import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { UserInputError } from '@nestjs/apollo';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: any) => {
        let validations = {};

        errors.forEach((error) => {
          validations[error.property] = Object.values(error.constraints).join(
            ', ',
          );
        });

        return new UserInputError('error', {
          extensions: { validations, category: 'validation' },
        });
      },
    }),
  );

  app.enableCors();
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
