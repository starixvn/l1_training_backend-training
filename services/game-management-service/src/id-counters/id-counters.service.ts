import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IdCounters, IdCountersDocument } from './schemas';
import { DataHandler } from '../common/providers';
import { Result } from '../common/models/result';

@Injectable()
export class IdCountersService {
    constructor(
        @InjectModel(IdCounters.name) private readonly IdCountersModel: Model<IdCountersDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async increaseIdCounter(gameName: string, modelNamePostFix: string): Promise<Result<number>> {
        const filter = { m: `${gameName}_${modelNamePostFix}`, f: 'id' };
        const increment = { $inc: { c: 1 } };
        const updateOptions = {
            new: true,
            lean: true,
            setDefaultsOnInsert: true,
            upsert: true,
            fields: { c: 1 },
        };
        const result = await this.dataHandler.getDataAndUpdate<IdCounters>(this.IdCountersModel, filter, increment, updateOptions);
        return new Result(result.errorCode, result.errorMessage, result.data?.c);
    }

    async getLatestId(gameName: string, modelNamePostFix: string): Promise<Result<number>> {
        const execution = this.IdCountersModel.findOne({ m: `${gameName}_${modelNamePostFix}` }, 'c')
            .lean()
            .exec();
        const result = await this.dataHandler.getData<IdCounters>(execution);
        return new Result(result.errorCode, result.errorMessage, result.data?.c ?? 0);
    }

    async updateLatestId(gameName: string, modelNamePostFix: string, id: number): Promise<Result<IdCounters>> {
        const filter = { m: `${gameName}_${modelNamePostFix}`, f: 'id' };
        const updates = { $set: { c: id } };
        const updateOptions = { setDefaultsOnInsert: true, upsert: true };
        return this.dataHandler.updateData(this.IdCountersModel, filter, updates, updateOptions);
    }
}
