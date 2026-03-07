import { Args, Query, Resolver, Subscription } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { PaginationDto } from 'src/common/pagination.dto';
import { Auth } from 'src/decorators/auth.decorator';
import { User } from 'generated/prisma/client';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver('Notification')
export class NotificationResolver {
  constructor(
    private notificationService: NotificationService,
    private pubSub: PubSub,
  ) {}

  @Query()
  async myNotifications(
    @Args('pagination') pagination: PaginationDto,
    @Auth() auth: User,
  ) {
    return this.notificationService.getMyNotifications(auth.id, pagination);
  }

  @Query()
  async notificationsCount(@Auth() auth: User) {
    return this.notificationService.getUserNotificationsCount(auth.id);
  }

  @Subscription(() => undefined, {
    filter: (payload, _, context) => {
      const authId = context.req.user.id;
      return payload.notificationReceived.receiverId === authId;
    },
  })
  async notificationReceived() {
    return this.pubSub.asyncIterableIterator('notificationReceived');
  }
}
