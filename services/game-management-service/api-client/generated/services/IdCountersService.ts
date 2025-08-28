/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { IdCounterResponse } from '../models/IdCounterResponse';
import type { IncreaseIdCounterRequest } from '../models/IncreaseIdCounterRequest';
import type { NumericalResult } from '../models/NumericalResult';
import type { UpdateLatestIdCounterRequest } from '../models/UpdateLatestIdCounterRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class IdCountersService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param requestBody 
     * @returns NumericalResult 
     * @throws ApiError
     */
    public increaseIdCounter(
requestBody: IncreaseIdCounterRequest,
): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/id-counters',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

    /**
     * @param gameName 
     * @param modelName 
     * @returns NumericalResult 
     * @throws ApiError
     */
    public getLatestId(
gameName: string,
modelName: string,
): CancelablePromise<NumericalResult> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/id-counters/latest-id',
            query: {
                'gameName': gameName,
                'modelName': modelName,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns IdCounterResponse 
     * @throws ApiError
     */
    public updateLatestId(
requestBody: UpdateLatestIdCounterRequest,
): CancelablePromise<IdCounterResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/id-counters/latest-id',
            body: requestBody,
            mediaType: 'application/json',
        });
    }

}
