export class CreateNotificationDto {
    receiverId: string;
    receiverRole: string;
    title: string;
    message: string;
    type: string;
    relatedId: string;
    isRead: boolean;
    expiresAt: Date;
  }