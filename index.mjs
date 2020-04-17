"use strict";

const _axios = require("axios");
const _crypto = require("crypto");
const _oAuth = require('oauth-1.0a');
const _url = require('url');

const _transform = require("./lib/transform");
const _parser = require("./lib/parser");

export default class MagentoRestApi {
    constructor(options) {
        if (!(this instanceof MagentoRestApi)) {
            return new MagentoRestApi(options);
        }

        options = options || {};

        if (!(options.url)) {
            throw new Error('URL is required');
        }

        if (!(options.consumerKey)) {
            throw new Error('consumerKey is required');
        }

        if (!(options.consumerSecret)) {
            throw new Error('consumerSecret is required');
        }

        if (!(options.accessToken)) {
            throw new Error('accessToken is required');
        }

        if (!(options.tokenSecret)) {
            throw new Error('tokenSecret is required');
        }

        this.clientVersion = require('./package.json').version;
        this._setDefaults(options);
    }

    _setDefaults(opt) {
        this.url = opt.url;
        this.consumerKey = opt.consumerKey;
        this.consumerSecret = opt.consumerSecret;
        this.accessToken = opt.accessToken;
        this.tokenSecret = opt.tokenSecret;
        this.endpointType = opt.type || 'V1';
        this.shaVersion = opt.sha || 'sha1';
        this.timeout = opt.timeout;
        this.axiosConfig = opt.axiosConfig || {};
        this.isSsl = /^https:\/\//i.test(this.url);
    }

    _normalizeQueryString(url) {
        if (!url.includes('?')) {
            return url;
        }

        let query = _url.parse(url, true).query;
        let params = Object.keys(query);
        let queryString = '';

        for (let i in params) {
            if (queryString.length) {
                queryString += '&';
            }

            queryString += encodeURIComponent(params[i]).replace(/%5B/g, '[').replace(/%5D/g, ']');
            queryString += '=';
            queryString += encodeURIComponent(query[params[i]]);
        }

        return url.split('?')[0] + '?' + queryString;
    }

    _getSHAType() {
        if (this.shaVersion === 256) {
            return {
                "signature": "HMAC-SHA256",
                "hash": "sha256"
            }
        } else if (this.shaVersion === 1) {
            return {
                "signature": "HMAC-SHA1",
                "hash": "sha1"
            }
        } else {
            throw new Error('Invalid SHA Version Specified.');
        }
    }

    _getOAuth(data) {
        let oauth = _oAuth({
            consumer: {
                key: this.consumerKey,
                secret: this.consumerSecret
            },
            signature_method: this._getSHAType().signature,
            hash_function(base_string, key) {
                return _crypto
                    .createHmac(this._getSHAType().hash, key)
                    .update(base_string)
                    .digest('base64')
            }
        });
        let token = {
            key: this.accessToken,
            secret: this.tokenSecret
        }
        return oauth.toHeader(oauth.authorize(data, token));
    }

    _formURL(endpoint) {
        let accessibleUrl = this.url.split(-1) === '/' ? this.url : this.url + '/';
        if (!this.isSsl) {
            endpoint = this._normalizeQueryString(endpoint);
        }

        return accessibleUrl + 'rest/' + this.endpointType + '/' + endpoint;
    }

    _formRequest(method, endpoint, data) {
        let request_data = {
            method: method,
            url: this._formURL(endpoint),
            body: data
        }

        let options = {
            method: method,
            url: request_data.url,
            timeout: this.timeout,
            headers: {
                'Authorization': this._getOAuth(request_data).Authorization,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            data: request_data.body
        }

        if (typeof process !== "undefined" && Object.prototype.toString.call(process) === "[object process]") {
            options.headers["User-Agent"] = "Magento REST API - JS Client/" + this.clientVersion;
        }

        options = { ...options, ...this.axiosConfig };

        return _axios(options);
    }

    _searchTranslate(params) {
        let paramObjKeys = Object.keys(params);
        let antiTrigger = ["filter_groups", "filterGroups", "sort_orders", "sortOrders", "page_size", "pageSize", "current_page", "currentPage"];
        let parserTrigger = paramObjKeys.filter(val => antiTrigger.includes(val));
        let operation = parserTrigger.length > 0 ? _transform : _parser;
        return operation(params);
    }

    get(endpoint, params) {
        if (params) {
            endpoint = endpoint + '?' + this._searchTranslate(params);
        }
        return this._formRequest('GET', endpoint);
    }

    post(endpoint, data) {
        return this._formRequest('POST', endpoint, data);
    }

    put(endpoint, data) {
        return this._formRequest('PUT', endpoint, data);
    }

    delete(endpoint) {
        return this._formRequest('DELETE', endpoint);
    }
}
