/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ContributeJackpotRequest } from '../models/ContributeJackpotRequest';
import type { CreatePoolRequest } from '../models/CreatePoolRequest';
import type { HitJackpotRequest } from '../models/HitJackpotRequest';
import type { JackPotResponse } from '../models/JackPotResponse';
import type { JackPotsResponse } from '../models/JackPotsResponse';
import type { JackPotWinnersResponse } from '../models/JackPotWinnersResponse';
import type { NumericalResult } from '../models/NumericalResult';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class JackpotsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameId 
     * @returns JackPotsResponse 
     * @throws ApiError
     */
    public getPools(
gameId: number,
): CancelablePromise<JackPotsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/jackpots/pools',
            query: {
                'gameId': gameId,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns JackPotResponse 
     * @throws ApiError
     */
    public createPool(
requestBody: CreatePoolRequest,
): CancelablePromise<JackPotResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/jackpots/pools',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param gameId 
     * @param pool 
     * @returns NumericalResult 
     * @throws ApiError
     */
    public getTotalExistingPools(
gameId: number,
pool: number,
): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/jackpots/pools/total-existing-pools',
            query: {
                'gameId': gameId,
                'pool': pool,
            },
        });
    }

    /**
     * @param gameId 
     * @returns NumericalResult 
     * @throws ApiError
     */
    public getLatestRoundId(
gameId: number,
): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/jackpots/latest-roundid',
            query: {
                'gameId': gameId,
            },
        });
    }

    /**
     * @param gameId 
     * @param page 
     * @param pageSize 
     * @returns JackPotWinnersResponse 
     * @throws ApiError
     */
    public getJackpotWinners(
gameId: number,
page: number,
pageSize: number,
): CancelablePromise<JackPotWinnersResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/jackpots/winners',
            query: {
                'gameId': gameId,
                'page': page,
                'pageSize': pageSize,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns JackPotResponse 
     * @throws ApiError
     */
    public contributeJackpot(
requestBody: ContributeJackpotRequest,
): CancelablePromise<JackPotResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/jackpots/contribute',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param requestBody 
     * @returns JackPotResponse 
     * @throws ApiError
     */
    public hitJackpot(
requestBody: HitJackpotRequest,
): CancelablePromise<JackPotResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/jackpots/hit',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
