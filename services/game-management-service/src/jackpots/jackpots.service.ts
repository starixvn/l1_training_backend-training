import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Jackpots, JackpotsDocument } from './schemas';
import { DataHandler } from '../common/providers';
import { ContributeJackpotRequest, CreatePoolRequest, HitJackpotRequest } from './models';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';

@Injectable()
export class JackpotsService {
    constructor(
        @InjectModel(Jackpots.name) private readonly JackpotsModel: Model<JackpotsDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getPools(gameId: number): Promise<Result<Jackpots[]>> {
        const filter = { gameId, winnerName: { $exists: false } };
        const projection = {
            _id: false,
            pool: true,
            amount: true,
        };
        const execution = this.JackpotsModel.find(filter, projection).lean().exec();
        return this.dataHandler.getData<Jackpots[]>(execution);
    }

    async contributeJackpot(request: ContributeJackpotRequest): Promise<Result<Jackpots>> {
        const { gameId, pool, roundId, amount, byBots, byMembers } = request;
        const runningPoolFilter = {
            gameId,
            pool,
            winnerName: { $exists: false },
            createdAt: { $lte: roundId },
        };
        const nearestPoolOrder = { createdAt: -1 };
        const poolAdjustment = { amount, byBots, byMembers };
        const updates = { gameId, $inc: poolAdjustment };
        const options = {
            new: true,
            lean: true,
            fields: { _id: false, amount: true },
            sort: nearestPoolOrder,
        };
        return this.dataHandler.getDataAndUpdate(this.JackpotsModel, runningPoolFilter, updates, options);
    }

    async hitJackpot(request: HitJackpotRequest): Promise<Result<Jackpots>> {
        const { gameId, pool, roundId, winningRatio, winnerName, winnerId, exchangeRateId, rate, currency, operatorId } = request;
        const runningPoolFilter = {
            gameId,
            pool,
            winnerName: { $exists: false },
            createdAt: { $lte: roundId },
        };
        const nearestRunningPoolOrder = { createdAt: -1 };
        const winnerAdjustment = {
            winningRatio,
            winnerName,
            winnerId,
            hitAt: roundId,
            hitTime: new Date(),
            exchangeRateId,
            rate,
            currency,
            operatorId,
        };
        const updates = { $set: winnerAdjustment };
        const winnerProjection = {
            _id: false,
            pool: true,
            winnerName: true,
            amount: true,
        };
        const options = {
            new: true,
            lean: true,
            fields: winnerProjection,
            sort: nearestRunningPoolOrder,
        };
        return this.dataHandler.getDataAndUpdate(this.JackpotsModel, runningPoolFilter, updates, options);
    }

    async getTotalExistingPools(gameId: number, pool: number): Promise<Result<number>> {
        const runningPoolsFilter = {
            gameId,
            pool,
            winnerName: { $exists: false },
        };
        const execution = this.JackpotsModel.countDocuments(runningPoolsFilter).exec();
        return this.dataHandler.getData(execution);
    }

    async createNewPool(request: CreatePoolRequest): Promise<Result<Jackpots>> {
        const { gameId, gameName, pool, initAmount, amount, roundId } = request;
        const doc = {
            gameId,
            gameName,
            pool,
            initAmount,
            amount,
            createdAt: roundId,
            createdTime: new Date(),
        };
        return this.dataHandler.createData<Jackpots>(this.JackpotsModel, doc);
    }

    async getLatestRoundId(gameId: number): Promise<Result<number>> {
        const runningPoolFilter = { gameId, winnerName: { $exists: false } };
        const execution = this.JackpotsModel.findOne(runningPoolFilter, 'createdAt', {
            sort: {
                createdAt: -1,
            },
        })
            .lean()
            .exec();
        const result = await this.dataHandler.getData(execution);

        return new Result(result.errorCode, result.errorMessage, result.data?.createdAt ?? 0);
    }

    async getJackpotWinners(gameId: number, page: number, pageSize: number): Promise<Result<{ winners: Jackpots[]; total: number }>> {
        const filter = {
            gameId,
            winnerName: { $exists: true },
        };
        const projection = {
            _id: false,
            hitTime: true,
            winnerName: true,
            pool: true,
            amount: true,
            winningRatio: true,
            exchangeRateId: true,
        };
        const numberOfSkippedWinners = (page - 1) * pageSize;
        const findWinners = this.JackpotsModel.find(filter, projection, {
            sort: { hitTime: -1 },
            skip: numberOfSkippedWinners,
            limit: pageSize,
        })
            .lean()
            .exec();
        const findTotalWinners = this.JackpotsModel.countDocuments(filter).exec();
        const winners = await this.dataHandler.getData<Jackpots[]>(findWinners);
        const total = await this.dataHandler.getData(findTotalWinners);
        if (winners.isSuccessful && total.isSuccessful) {
            return new Result(ErrorCodes.Success, ErrorMessages.Empty, { winners: winners.data, total: total.data });
        }
        return new Result(ErrorCodes.Failed, winners.errorMessage || total.errorMessage);
    }
}
