import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Domains, DomainsDocument } from './schemas';
import { SentryLogger } from '../common/providers';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class DomainService {
    constructor(
        @InjectModel(Domains.name) private readonly model: Model<DomainsDocument>,
        private readonly logger: SentryLogger,
    ) {}

    async getDomains(): Promise<Result<Domains>> {
        try {
            const data = (await this.model.findOne({}).lean().exec()) as Domains;
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, data);
        } catch (error) {
            this.logger.error(error);
            return new Result(ErrorCodes.Failed, error.message);
        }
    }
}
