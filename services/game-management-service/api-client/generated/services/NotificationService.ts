/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { UmMessageResponse } from '../models/UmMessageResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class NotificationService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param configName 
     * @returns UmMessageResponse 
     * @throws ApiError
     */
    public getUmMessages(
configName: string,
): CancelablePromise<UmMessageResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/notification/um-messages',
            query: {
                'configName': configName,
            },
        });
    }

}
