import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { ArchiveStatuses, ArchiveStatusesDocument } from './schemas';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class ArchiveStatusService {
    constructor(
        @InjectModel(ArchiveStatuses.name) private readonly model: Model<ArchiveStatusesDocument>,
        private readonly logger: SentryLogger,
    ) {}

    async getArchiveStatus(gameName: string): Promise<Result<ArchiveStatuses>> {
        try {
            const data = (await this.model.findOne({ name: gameName }).lean().exec()) as ArchiveStatuses;
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, data);
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
