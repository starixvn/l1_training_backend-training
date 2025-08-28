import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { Notification, NotificationSchema } from './schemas';

@Module({
    imports: [MongooseModule.forFeature([{ name: Notification.name, schema: NotificationSchema, collection: 'notifications' }])],
    providers: [NotificationService],
    exports: [NotificationService],
    controllers: [NotificationController],
})
export class NotificationModule {}
