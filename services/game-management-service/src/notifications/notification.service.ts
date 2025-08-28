import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Notification, NotificationDocument } from './schemas';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(Notification.name) private readonly model: Model<NotificationDocument>,
        private readonly logger: SentryLogger,
    ) {}

    async getUMMessage(configName: string): Promise<Result<object>> {
        try {
            const data = await this.model.findOne({ gameName: configName, displayKind: 2 }, 'messages').lean().exec();
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, data?.messages ?? {});
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
