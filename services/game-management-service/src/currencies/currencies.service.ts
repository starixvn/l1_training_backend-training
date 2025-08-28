import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Currencies, CurrenciesDocument } from './schemas';
import { DataHandler } from '../common/providers';
import { Result } from '../common/models/result';

@Injectable()
export class CurrenciesService {
    constructor(
        @InjectModel(Currencies.name) private readonly CurrenciesModel: Model<CurrenciesDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getCurrencies(): Promise<Result<Currencies[]>> {
        const execution = this.CurrenciesModel.find({ enabled: true }, { _id: 0 }).lean().exec();
        return this.dataHandler.getData(execution);
    }
}
