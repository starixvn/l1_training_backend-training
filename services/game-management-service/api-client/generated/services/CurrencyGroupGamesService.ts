/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyGroupGamesResponse } from '../models/CurrencyGroupGamesResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CurrencyGroupGamesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameId 
     * @returns CurrencyGroupGamesResponse 
     * @throws ApiError
     */
    public getCurrencyGroupGamesByGameId(
gameId: number,
): CancelablePromise<CurrencyGroupGamesResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/currency-group-games',
            query: {
                'gameId': gameId,
            },
        });
    }

}
