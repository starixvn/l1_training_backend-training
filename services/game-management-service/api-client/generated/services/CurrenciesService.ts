/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CurrenciesResponse } from '../models/CurrenciesResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class CurrenciesService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns CurrenciesResponse 
     * @throws ApiError
     */
    public getCurrencies(): CancelablePromise<CurrenciesResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/currencies',
        });
    }

}
