import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { OperatorConfig, OperatorConfigDocument } from './schemas';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class OperatorConfigService {
    constructor(
        @InjectModel(OperatorConfig.name) private readonly model: Model<OperatorConfigDocument>,
        private readonly logger: SentryLogger,
    ) {}

    async getGameSiteExclusions(): Promise<Result<OperatorConfig[]>> {
        try {
            const data = (await this.model
                .find({ type: 'game_site_exclusions' }, 'partnerId type value')
                .lean()
                .exec()) as OperatorConfig[];
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, data);
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
