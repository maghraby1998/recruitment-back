import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PubSub } from 'graphql-subscriptions';
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
import { DateTimeScalar } from './date-time.scalar';
import { PositionModule } from './position/position.module';
import { SkillModule } from './skill/skill.module';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import configurations from 'config/configurations';
import { ThrottlerModule } from '@nestjs/throttler';
import { GqlThrottlerGuard } from './guards/throttler.guard';
import { ExperienceModule } from './experience/experience.module';
import { NotificationModule } from './notification/notification.module';
import jwt from 'jsonwebtoken';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configurations],
    }),

    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      graphiql: true,
      context: ({ req, res, extra }) => {
        // For WebSocket subscriptions, use the upgrade request from extra
        if (extra?.request) {
          return { req: extra.request };
        }
        return { req, res };
      },
      subscriptions: {
        'graphql-ws': {
          onConnect: (ctx: any) => {
            const request = ctx.extra.request;
            const cookies = request.headers?.cookie || '';
            const authInfoMatch = cookies
              .split(';')
              .map((c) => c.trim())
              .find((c) => c.startsWith('auth_info='));

            if (!authInfoMatch) {
              throw new Error('Missing auth cookie');
            }

            const authInfoValue = decodeURIComponent(
              authInfoMatch.split('=').slice(1).join('='),
            );
            const accessToken = JSON.parse(authInfoValue)?.accessToken;

            if (!accessToken) {
              throw new Error('Token is not valid');
            }

            const decoded = jwt.verify(
              accessToken,
              'randomsecretfornowthatshouldbereplacedlater',
            ) as { id: string };

            // Store token on the request-like object so the AuthGuard can access it
            (ctx.extra.request as any).headers = {
              ...ctx.extra.request.headers,
              authorization: `Bearer ${accessToken}`,
            };
          },
        },
      },
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
    PositionModule,
    SkillModule,
    PostModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60000,
          limit: 60,
        },
      ],
    }),
    ExperienceModule,
    NotificationModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    DateTimeScalar,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: GqlThrottlerGuard,
    },
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
})
export class AppModule {
  configure(consumer) {
    consumer
      .apply(graphqlUploadExpress({ maxFileSize: 15000000, maxFiles: 20 }))
      .forRoutes('*');
  }
}
