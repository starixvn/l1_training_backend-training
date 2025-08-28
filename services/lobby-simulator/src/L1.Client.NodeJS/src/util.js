const Axios = require("axios").default;

const hmacSHA256 = require("crypto-js/hmac-sha256");
const Base64 = require("crypto-js/enc-base64");

const defaultTimeout = 2500; // ms

const handleSuccess = (resolve, callback) => (body) => {
    callback && callback(null, body);
    resolve(body);
};

const handleError = (reject, callback) => (error) => {
    callback && callback(error);
    reject(error);
};

const sendPostRequest =
    (action, { apiUrl, token, useAuthenticate, requestTimeout }, generateAccessKey) =>
    (params, callback) =>
        new Promise((resolve, reject) => {
            const languageCode = params.languageCode ? { LanguageCode: params.languageCode } : {};
            const authorization = useAuthenticate ? { Authorization: token } : {};
            const config = {
                headers: { ...authorization, ...languageCode },
                timeout: requestTimeout || defaultTimeout
            };

            if (params.languageCode) {
                delete params.languageCode;
            }

            if (generateAccessKey && params.auth.operatorSecret) {
                const hashResult = hmacSHA256(JSON.stringify(params), params.auth.operatorSecret);
                const hashString = Base64.stringify(hashResult);
                config.headers["Access-Key"] = hashString;
            }

            Axios.post(`${apiUrl}${action}`, params, config)
                .then((data) => data.data)
                .then(handleSuccess(resolve, callback))
                .catch(handleError(reject, callback));
        });

const createAction = (metadata, config) =>
    metadata.reduce((result, data) => {
        result[data.name] = sendPostRequest(data.action, config, data.generateAccessKey);
        return result;
    }, {});

module.exports = {
    sendPostRequest,
    createAction
};
