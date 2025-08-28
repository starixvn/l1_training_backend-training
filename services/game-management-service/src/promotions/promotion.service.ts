import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Promotion, PromotionDocument } from './schemas';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class PromotionService {
    constructor(
        @InjectModel(Promotion.name) private readonly model: Model<PromotionDocument>,
        private readonly logger: SentryLogger,
    ) {}

    async getPromotions(gameId: number): Promise<Result<Promotion[]>> {
        try {
            const data = (await this.model.find({ gameId, status: 'enabled' }).lean().exec()) as Promotion[];
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, data);
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
