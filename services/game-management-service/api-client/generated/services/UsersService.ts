/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BotsResponse } from '../models/BotsResponse';
import type { NumericalResult } from '../models/NumericalResult';
import type { ResetBotInRoomRequest } from '../models/ResetBotInRoomRequest';
import type { Result } from '../models/Result';
import type { SetBalanceAndDecreaseScoinsRequest } from '../models/SetBalanceAndDecreaseScoinsRequest';
import type { SetBalanceRequest } from '../models/SetBalanceRequest';
import type { UpdateBalanceRequest } from '../models/UpdateBalanceRequest';
import type { UpdateBotsBalanceRequest } from '../models/UpdateBotsBalanceRequest';
import type { UpdateBotsBalanceResponse } from '../models/UpdateBotsBalanceResponse';
import type { UpdateBotsJoinRoomRequest } from '../models/UpdateBotsJoinRoomRequest';
import type { UpdateBotsOutRoomRequest } from '../models/UpdateBotsOutRoomRequest';
import type { UpdateStakeLevelRequest } from '../models/UpdateStakeLevelRequest';
import type { UserInfoResponse } from '../models/UserInfoResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class UsersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param limit 
     * @returns BotsResponse 
     * @throws ApiError
     */
    public getAllBots(
limit: number,
): CancelablePromise<BotsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/bots',
            query: {
                'limit': limit,
            },
        });
    }

    /**
     * @returns NumericalResult 
     * @throws ApiError
     */
    public getTotalBots(): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/bots/total',
        });
    }

    /**
     * @returns BotsResponse 
     * @throws ApiError
     */
    public getDisableBots(): CancelablePromise<BotsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/bots/disabled-bots',
        });
    }

    /**
     * @param requestBody 
     * @returns Result 
     * @throws ApiError
     */
    public updateBotsOutRoom(
requestBody: UpdateBotsOutRoomRequest,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/bots/out-room',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns Result 
     * @throws ApiError
     */
    public updateBotsJoinRoom(
requestBody: UpdateBotsJoinRoomRequest,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/bots/join-room',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns Result 
     * @throws ApiError
     */
    public resetBotsInRoom(
requestBody: ResetBotInRoomRequest,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/bots/reset-in-room',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param id 
     * @returns UserInfoResponse 
     * @throws ApiError
     */
    public getUserInfo(
id: string,
): CancelablePromise<UserInfoResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/info',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @param id 
     * @returns NumericalResult 
     * @throws ApiError
     */
    public getUserScoins(
id: string,
): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/users/scoins',
            query: {
                'id': id,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns Result 
     * @throws ApiError
     */
    public updateUserStakeLevel(
requestBody: UpdateStakeLevelRequest,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/update-stake-level',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserInfoResponse 
     * @throws ApiError
     */
    public updateBalance(
requestBody: UpdateBalanceRequest,
): CancelablePromise<UserInfoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/update-balance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns UpdateBotsBalanceResponse 
     * @throws ApiError
     */
    public updateBotsBalance(
requestBody: UpdateBotsBalanceRequest,
): CancelablePromise<UpdateBotsBalanceResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/update-bots-balance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserInfoResponse 
     * @throws ApiError
     */
    public setBalance(
requestBody: SetBalanceRequest,
): CancelablePromise<UserInfoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/set-balance',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns UserInfoResponse 
     * @throws ApiError
     */
    public setBalanceAndDecreaseScoins(
requestBody: SetBalanceAndDecreaseScoinsRequest,
): CancelablePromise<UserInfoResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/users/set-balance-and-decrease-scoins',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
