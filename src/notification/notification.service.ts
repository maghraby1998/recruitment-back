import { Inject, Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { PrismaService } from 'src/prisma.service';
import { CreateNotificationDto } from './dtos/create-notification.dto';
import { PaginationDto } from 'src/common/pagination.dto';
import {
  buildPaginatedResult,
  getPrismaPageArgs,
} from 'src/common/pagination.helper';
import { PubSub } from 'graphql-subscriptions';

@Injectable()
export class NotificationService {
  constructor(
    @Inject('FIREBASE_ADMIN')
    private readonly firebaseApp: admin.app.App,
    private prismaService: PrismaService,
    private pubSub: PubSub,
  ) {}

  async sendPushNotification(
    receiverId: number,
    token: string,
    title: string,
    body: string,
  ) {
    await this.storeNotification(receiverId, {
      title,
      body,
    });

    await this.pubSub.publish('notificationReceived', {
      notificationReceived: { receiverId },
    });

    const message: admin.messaging.Message = {
      token,
      notification: {
        title,
        body,
      },
    };

    return this.firebaseApp.messaging().send(message);
  }

  async storeNotification(
    receiverId: number,
    notificationData: CreateNotificationDto,
  ) {
    await this.prismaService.notification.create({
      data: {
        receiverId,
        title: notificationData.title,
        body: notificationData.body,
      },
    });
  }

  async getMyNotifications(userId: number, pagination: PaginationDto) {
    const paginationArgs = getPrismaPageArgs(pagination);

    const notifications = await this.prismaService.notification.findMany({
      where: {
        receiverId: userId,
      },
      skip: paginationArgs.skip,
      take: paginationArgs.take,
      orderBy: {
        created_at: 'desc',
      },
    });

    const totalNotifications = await this.prismaService.notification.count({
      where: {
        receiverId: userId,
      },
    });

    return buildPaginatedResult(notifications, totalNotifications, pagination);
  }

  async getUserNotificationsCount(userId: number) {
    return this.prismaService.notification.count({
      where: {
        receiverId: userId,
      },
    });
  }
}
