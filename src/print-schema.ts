import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import { printSchema } from 'graphql';
import { writeFileSync } from 'fs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });
  await app.init();

  const { schema } = app.get(GraphQLSchemaHost);
  const sdl = printSchema(schema);

  const outputPath = join(__dirname, '..', 'schema.graphql');
  writeFileSync(outputPath, sdl);

  console.log(`Schema exported to ${outputPath}`);

  await app.close();
}

bootstrap();
