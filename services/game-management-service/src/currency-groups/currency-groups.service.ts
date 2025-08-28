import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CurrencyGroups, CurrencyGroupsDocument } from './schemas';
import { DataHandler } from '../common/providers';
import { Result } from '../common/models/result';

@Injectable()
export class CurrencyGroupsService {
    constructor(
        @InjectModel(CurrencyGroups.name) private readonly CurrencyGroupsModel: Model<CurrencyGroupsDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getCurrencyGroups(): Promise<Result<CurrencyGroups[]>> {
        const execution = this.CurrencyGroupsModel.find({ enabled: true }).lean().exec();
        return this.dataHandler.getData<CurrencyGroups[]>(execution);
    }
}
