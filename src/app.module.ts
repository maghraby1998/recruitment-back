import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UserModule } from './user/user.module';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './guards/auth.guard';
import { EmployeeModule } from './employee/employee.module';
import { CompanyModule } from './company/company.module';
import { JobPostModule } from './job-post/job-post.module';
import { ApplicationModule } from './application/application.module';
import graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.mjs';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      graphiql: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    JwtModule.register({
      global: true,
      secret: 'randomsecretfornowthatshouldbereplacedlater',
    }),
    EmployeeModule,
    CompanyModule,
    JobPostModule,
    ApplicationModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: {
        index: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 1 }))
      .forRoutes('*');
  }
}
