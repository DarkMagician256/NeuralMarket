"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTTPClient = void 0;
const CryptoJS = __importStar(require("crypto-js"));
class APIError extends Error {
    constructor(message, status, statusText, responseBody, requestDetails) {
        super(message);
        this.status = status;
        this.statusText = statusText;
        this.responseBody = responseBody;
        this.requestDetails = requestDetails;
        this.name = 'APIError';
    }
}
class HTTPClient {
    constructor(config) {
        this.config = {
            baseUrl: 'https://web3.okx.com',
            maxRetries: 3,
            timeout: 30000,
            ...config
        };
    }
    getHeaders(timestamp, method, path, queryString = "") {
        const stringToSign = timestamp + method + path + queryString;
        // Ensure the string is properly encoded
        const encodedString = CryptoJS.enc.Utf8.parse(stringToSign);
        const secretKey = CryptoJS.enc.Utf8.parse(this.config.secretKey);
        // Create HMAC-SHA256 signature
        const signature = CryptoJS.HmacSHA256(encodedString, secretKey);
        return {
            "Content-Type": "application/json",
            "OK-ACCESS-KEY": this.config.apiKey,
            "OK-ACCESS-SIGN": CryptoJS.enc.Base64.stringify(signature),
            "OK-ACCESS-TIMESTAMP": timestamp,
            "OK-ACCESS-PASSPHRASE": this.config.apiPassphrase,
            "OK-ACCESS-PROJECT": this.config.projectId,
        };
    }
    async handleErrorResponse(response, requestDetails) {
        let responseBody;
        try {
            responseBody = await response.json();
        }
        catch (e) {
            responseBody = await response.text();
        }
        throw new APIError(`HTTP error! status: ${response.status}`, response.status, response.statusText, responseBody, requestDetails);
    }
    async request(method, path, params) {
        const timestamp = new Date().toISOString();
        // Filter out undefined values from params
        const cleanParams = params ? Object.fromEntries(Object.entries(params).filter(([_, v]) => v !== undefined)) : undefined;
        const queryString = cleanParams ? "?" + new URLSearchParams(cleanParams).toString() : "";
        const headers = this.getHeaders(timestamp, method, path, queryString);
        const requestDetails = {
            method,
            path,
            params: cleanParams,
            queryString,
            url: `${this.config.baseUrl}${path}${queryString}`
        };
        // Log request details in development
        if (process.env.NODE_ENV === 'development') {
            console.log('Request Details:', {
                url: requestDetails.url,
                method: requestDetails.method,
                headers: {
                    ...headers,
                    'OK-ACCESS-SIGN': '***', // Hide sensitive data
                    'OK-ACCESS-KEY': '***',
                    'OK-ACCESS-PASSPHRASE': '***'
                },
                params: requestDetails.params
            });
        }
        let retries = 0;
        while (retries < this.config.maxRetries) {
            try {
                const response = await fetch(`${this.config.baseUrl}${path}${queryString}`, {
                    method,
                    headers
                });
                if (!response.ok) {
                    await this.handleErrorResponse(response, requestDetails);
                }
                const data = await response.json();
                // Log response in development
                if (process.env.NODE_ENV === 'development') {
                    console.log('Response:', JSON.stringify(data, null, 2));
                }
                if (data.code !== "0") {
                    throw new APIError(`API Error: ${data.msg}`, response.status, response.statusText, data, requestDetails);
                }
                return data;
            }
            catch (error) {
                if (error instanceof APIError) {
                    if (retries === this.config.maxRetries - 1)
                        throw error;
                }
                else {
                    if (retries === this.config.maxRetries - 1) {
                        throw new APIError(error instanceof Error ? error.message : 'Unknown error', undefined, undefined, undefined, requestDetails);
                    }
                }
                retries++;
                await new Promise(resolve => setTimeout(resolve, 1000 * retries));
            }
        }
        throw new Error("Max retries exceeded");
    }
}
exports.HTTPClient = HTTPClient;
