import { Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ErrorCodes, ErrorMessages, Result } from '../common/models/result';
import { DataHandler } from '../common/providers';
import { UserInfos, UserInfosDocument } from './schemas';
import { UpdateBalanceRequest, UpdateStakeLevelRequest, UpdateBotsBalanceRequest } from './models';

Injectable();
export class UsersService {
    constructor(
        @InjectModel(UserInfos.name) private readonly userInfoModel: Model<UserInfosDocument>,
        @Inject(DataHandler) private readonly dataHandler: DataHandler,
    ) {}

    async getTotalBots(): Promise<Result<number>> {
        const filter = { type: true, banned: false };
        const execution = this.userInfoModel.countDocuments(filter).exec();
        return this.dataHandler.getData(execution);
    }

    async getDisableBots(): Promise<Result<UserInfos[]>> {
        const filter = { type: true, disabled: true };
        const execution = this.userInfoModel.find(filter).lean().exec();
        return this.dataHandler.getData<UserInfos[]>(execution);
    }

    async getAllBots(limit = 20): Promise<Result<UserInfos[]>> {
        const filter = { type: true, disabled: false, inRoom: false };

        const execution = this.userInfoModel
            .aggregate([{ $match: filter }, { $sample: { size: limit } }, { $project: { id: 1, name: 1, avatarId: 1, red: 1, type: 1 } }])
            .exec();

        return this.dataHandler.getData<UserInfos[]>(execution);
    }

    async updateBotsOutRoom(botIds: string[]): Promise<Result<unknown>> {
        const filter = { id: { $in: botIds } };
        const updates = { inRoom: false, inGameRoom: '', patternId: 0 };
        return this.dataHandler.updateManyData(this.userInfoModel, filter, updates);
    }

    async updateBotsJoinRoom(botIds: string[], gameName: string): Promise<Result<unknown>> {
        const filter = { id: { $in: botIds } };
        const updates = { inRoom: true, inGameRoom: gameName };
        return this.dataHandler.updateManyData(this.userInfoModel, filter, updates);
    }

    async resetBotsInRoom(gameName: string): Promise<Result<unknown>> {
        const filter = { type: true, inGameRoom: gameName };
        const updates = { inRoom: false, inGameRoom: '' };
        return this.dataHandler.updateManyData(this.userInfoModel, filter, updates);
    }

    async getUserInfo(id: string): Promise<Result<UserInfos>> {
        const filter = { id: id };
        const execution = this.userInfoModel.findOne(filter, { _id: 0, __v: 0 }).lean().exec();
        return this.dataHandler.getData<UserInfos>(execution);
    }

    async getScoins(id: string): Promise<Result<number>> {
        const filter = { id: id };
        const execution = this.userInfoModel.findOne(filter, 'scoins').lean().exec();
        const result = await this.dataHandler.getData(execution);
        return new Result(result.errorCode, result.errorMessage, result.data?.scoins ?? 0);
    }

    async updateStakeLevel(request: UpdateStakeLevelRequest): Promise<Result<unknown>> {
        const filter = { id: request.id };
        const updates = { minBet: request.minBet, maxBet: request.maxBet, betLimitModifiedDate: new Date() };
        return this.dataHandler.updateData(this.userInfoModel, filter, updates);
    }

    async updateBalance(request: UpdateBalanceRequest): Promise<Result<UserInfos>> {
        const filter = { id: request.id, red: { $gt: request.deductionAmount } };
        const updates = { $inc: { red: -request.deductionAmount } };
        const options = { new: true, lean: true };
        return this.dataHandler.getDataAndUpdate(this.userInfoModel, filter, updates, options);
    }

    async updateBotsBalance(request: UpdateBotsBalanceRequest): Promise<Result<UserInfos[]>> {
        const userInfosResults = await Promise.all(request.bots.map(async (bot) => this.updateBalance(bot)));
        return new Result(
            ErrorCodes.Success,
            ErrorMessages.Empty,
            userInfosResults.map((result) => result.data).filter((result) => result),
        );
    }

    async setBalance(id: string, amount: number): Promise<Result<UserInfos>> {
        const filter = { id: id };
        const updates = { red: amount };
        const options = { new: true, lean: true };
        return this.dataHandler.getDataAndUpdate(this.userInfoModel, filter, updates, options);
    }

    async setBalanceAndUpdateScoins(id: string, balance: number, deductionScoins: number) {
        const scoinsDecrease = deductionScoins !== 0 ? { scoins: -deductionScoins } : {};
        const filter = { id: id };
        const updates = { $set: { red: balance }, $inc: scoinsDecrease };
        const options = { new: true, lean: true };
        return this.dataHandler.getDataAndUpdate<UserInfos>(this.userInfoModel, filter, updates, options);
    }
}
