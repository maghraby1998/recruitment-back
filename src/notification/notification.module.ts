import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { FirebaseAdminProvider } from './notification.provider';

@Module({
  providers: [FirebaseAdminProvider, NotificationService, NotificationResolver],
  exports: [NotificationService],
})
export class NotificationModule {}
