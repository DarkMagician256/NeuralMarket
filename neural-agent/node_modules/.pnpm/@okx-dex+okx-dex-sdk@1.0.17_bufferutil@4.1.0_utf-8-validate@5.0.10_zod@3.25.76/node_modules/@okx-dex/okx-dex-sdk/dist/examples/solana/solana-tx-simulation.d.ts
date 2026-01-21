export declare function getHeaders(timestamp: string, method: string, requestPath: string, queryString?: string, requestBody?: string): {
    "Content-Type": string;
    "OK-ACCESS-KEY": string;
    "OK-ACCESS-SIGN": string;
    "OK-ACCESS-TIMESTAMP": string;
    "OK-ACCESS-PASSPHRASE": string;
};
