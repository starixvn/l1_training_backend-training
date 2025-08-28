import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { GameConfigs, GameConfigsDocument } from './schemas';
import { Result } from '../common/models/result';
import { DataHandler } from '../common/providers';

@Injectable()
export class GameConfigsService {
    constructor(
        @InjectModel(GameConfigs.name) private readonly gameConfigsModel: Model<GameConfigsDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getGameConfigs(gameName: string): Promise<Result<GameConfigs>> {
        const filter = { name: gameName };
        const execution = this.gameConfigsModel.findOne(filter).lean().exec() as Promise<GameConfigs>;

        return this.dataHandler.getData<GameConfigs>(execution);
    }

    async getGameConfigsById(gameId: number): Promise<Result<GameConfigs>> {
        const filter = { gameId: gameId };
        const execution = this.gameConfigsModel.findOne(filter).lean().exec() as Promise<GameConfigs>;

        return this.dataHandler.getData<GameConfigs>(execution);
    }

    async updateExchangeReload(gameName: string, exchangeReload: boolean): Promise<Result<any>> {
        const filter = { name: gameName };
        const updates = { $set: { exchangeReload } };

        return this.dataHandler.updateData(this.gameConfigsModel, filter, updates);
    }

    async updateDisabledround(gameName: string, roundId: number): Promise<Result<any>> {
        const filter = { name: gameName };
        const updates = { $set: { disabledround: roundId } };

        return this.dataHandler.updateData(this.gameConfigsModel, filter, updates);
    }
}
