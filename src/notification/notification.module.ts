import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { FirebaseAdminProvider } from './notification.provider';
import { PrismaService } from 'src/prisma.service';
import { PubSub } from 'graphql-subscriptions';

@Module({
  providers: [
    FirebaseAdminProvider,
    NotificationService,
    NotificationResolver,
    PrismaService,
    PubSub,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
