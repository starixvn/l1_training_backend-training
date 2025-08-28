/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { PromotionResponse } from '../models/PromotionResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class PromotionService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameId 
     * @returns PromotionResponse 
     * @throws ApiError
     */
    public getPromotions(
gameId: number,
): CancelablePromise<PromotionResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/promotion',
            query: {
                'gameId': gameId,
            },
        });
    }

}
