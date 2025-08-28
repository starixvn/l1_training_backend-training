/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { OperatorConfigsResponse } from '../models/OperatorConfigsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class OperatorConfigService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns OperatorConfigsResponse 
     * @throws ApiError
     */
    public getGameSiteExclusions(): CancelablePromise<OperatorConfigsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/operator-config/game-site-exclusions',
        });
    }

}
