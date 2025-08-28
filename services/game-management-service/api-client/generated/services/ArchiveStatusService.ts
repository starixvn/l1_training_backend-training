/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ArchiveStatusesResponse } from '../models/ArchiveStatusesResponse';

import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';

export class ArchiveStatusService {

    constructor(public readonly httpRequest: BaseHttpRequest) {}

    /**
     * @param gameName 
     * @returns ArchiveStatusesResponse 
     * @throws ApiError
     */
    public getArchiveStatus(
gameName: string,
): CancelablePromise<ArchiveStatusesResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/archive-status',
            query: {
                'gameName': gameName,
            },
        });
    }

}
