/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DomainResponse } from '../models/DomainResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class DomainService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @returns DomainResponse 
     * @throws ApiError
     */
    public getDomain(): CancelablePromise<DomainResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/domain',
        });
    }

}
