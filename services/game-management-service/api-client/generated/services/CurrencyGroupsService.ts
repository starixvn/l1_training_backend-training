/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrencyGroupsResponse } from '../models/CurrencyGroupsResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CurrencyGroupsService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns CurrencyGroupsResponse 
     * @throws ApiError
     */
    public getCurrencyGroups(): CancelablePromise<CurrencyGroupsResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/currency-groups',
        });
    }

}
