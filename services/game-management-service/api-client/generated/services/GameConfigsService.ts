/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { GameConfigResponse } from '../models/GameConfigResponse';
import type { Result } from '../models/Result';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class GameConfigsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameName 
     * @returns GameConfigResponse 
     * @throws ApiError
     */
    public getGameConfigs(
gameName: string,
): CancelablePromise<GameConfigResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game-configs',
            query: {
                'gameName': gameName,
            },
        });
    }

    /**
     * @param gameId 
     * @returns GameConfigResponse 
     * @throws ApiError
     */
    public getGameConfigsById(
gameId: number,
): CancelablePromise<GameConfigResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/game-configs/byid',
            query: {
                'gameId': gameId,
            },
        });
    }

    /**
     * @param exchangeReload 
     * @param gameName 
     * @returns Result 
     * @throws ApiError
     */
    public updateExchangeReload(
exchangeReload: boolean,
gameName: string,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/game-configs/exchange-reload',
            path: {
                'exchangeReload': exchangeReload,
                'gameName': gameName,
            },
        });
    }

    /**
     * @param roundId 
     * @param gameName 
     * @returns Result 
     * @throws ApiError
     */
    public updateDisabledround(
roundId: number,
gameName: string,
): CancelablePromise<Result> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/game-configs/disabled-round',
            path: {
                'roundId': roundId,
                'gameName': gameName,
            },
        });
    }

}
