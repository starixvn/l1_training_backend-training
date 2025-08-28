/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { SettingForNewRoundResponse } from '../models/SettingForNewRoundResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class AggregationService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameId 
     * @returns SettingForNewRoundResponse 
     * @throws ApiError
     */
    public getSettingForNewRound(
gameId: number,
): CancelablePromise<SettingForNewRoundResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/aggregation/get-setting-for-new-round',
            query: {
                'gameId': gameId,
            },
        });
    }

}
