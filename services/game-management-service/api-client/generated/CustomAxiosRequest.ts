import type { ApiRequestOptions } from "./core/ApiRequestOptions";
import { BaseHttpRequest } from "./core/BaseHttpRequest";
import type { CancelablePromise } from "./core/CancelablePromise";
import type { OpenAPIConfig } from "./core/OpenAPI";
import { request as __request } from "./core/request";
import https from "https";
import http from "http";
import axios from "axios";
import axiosRetry from "axios-retry";

const defaultTimeout = 5000;
export class CustomAxiosRequest extends BaseHttpRequest {
    axiosInstance = axios.create({
        httpsAgent: new https.Agent({ keepAlive: true }),
        httpAgent: new http.Agent({ keepAlive: true }),
        timeout: defaultTimeout,
        timeoutErrorMessage: "CustomAxiosRequest timeout",
    });

    constructor(config: OpenAPIConfig) {
        super(config);
        axiosRetry(this.axiosInstance);
    }

    /**
     * Request method
     * @param options The request options from the service
     * @returns CancelablePromise<T>
     * @throws ApiError
     */
    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        return __request(this.config, options, this.axiosInstance);
    }
}
