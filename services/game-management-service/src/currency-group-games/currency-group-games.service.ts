import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CurrencyGroupGames, CurrencyGroupGamesDocument } from './schemas';
import { DataHandler } from '../common/providers';
import { Result } from '../common/models/result';

@Injectable()
export class CurrencyGroupGamesService {
    constructor(
        @InjectModel(CurrencyGroupGames.name) private readonly CurrencyGroupGamesModel: Model<CurrencyGroupGamesDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getCurrencyGroupGamesByGameId(gameId: number): Promise<Result<CurrencyGroupGames[]>> {
        const execution = this.CurrencyGroupGamesModel.find({ gameId, enabled: true }, { _id: 0 }).lean().exec();
        return this.dataHandler.getData<CurrencyGroupGames[]>(execution);
    }
}
