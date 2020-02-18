"use strict";

const _axios = require("axios");
const _crypto = require("crypto");
const _oAuth = require('oauth-1.0a');
const _url = require('url');

// Libraries to be used in case of Magento 2.X
const _transform_2 = require("./lib/transform2");
const _parser_2 = require("./lib/parser");

// Libraries to be used in case of Mageto 1.X
const _transform_1 = require("./lib/transform1");

/**
 * Magento REST API Wrapper
 * 
 * @param {Object} options
 */
class MagentoRestAPI {
    /**
     * Class constructor
     * @param {Object} options 
     */
    constructor(options) {
        if (!(this instanceof MagentoRestAPI)) {
            return new MagentoRestAPI(options);
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

    /**
     * Set default Options
     * @param {Object} opt
     */
    _setDefaults(opt) {
        this.url = opt.url;
        this.consumerKey = opt.consumerKey;
        this.consumerSecret = opt.consumerSecret;
        this.accessToken = opt.accessToken;
        this.tokenSecret = opt.tokenSecret;
        this.storeVersion = opt.version || 2;
        this.endpointType = opt.type || 'V1';
        this.isSsl = (/^https:\/\//i).test(this.url);
    }

    /**
     * Normalize query string for oAuth
     *
     * @param  {String} url
     *
     * @return {String}
     */
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

    /**
     * Get oAuth 
     * 
     * @param {Object} data
     * @return {Object}
     */
    _getOAuth(data) {
        let oauth = _oAuth({
            consumer: {
                key: this.consumerKey,
                secret: this.consumerSecret
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return _crypto
                    .createHmac("sha1", key)
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

    /**
     * Form URL for requests
     * 
     * @param {String} endpoint
     * @return {String}
     */
    _formURL(endpoint) {
        let accessibleUrl = this.url.split(-1) === '/' ? this.url : this.url + '/';
        if (!this.isSsl) {
            endpoint = this._normalizeQueryString(endpoint);
        }
        if (this.storeVersion < 2) {
            return accessibleUrl + 'api/rest/' + endpoint;
        } else {
            return accessibleUrl + 'rest/' + this.endpointType + '/' + endpoint;
        }
    }

    /**
     * Form requests to query magento store
     * 
     * @param {String} method
     * @param {String} endpoint
     * @param {Object} data
     */
    _formRequest(method, endpoint, data) {
        let request_data = {
            method: method,
            url: this._formURL(endpoint),
            body: data
        }
        return _axios({
            method: method,
            url: request_data.url,
            headers: {
                'Authorization': this._getOAuth(request_data).Authorization,
                'Content-Type': 'application/json'
            },
            data: request_data.body
        });
    }

    /**
     * Search Translation for query strings
     * 
     * @param {Object} params
     */
    _searchTranslate(params) {
        if (!params || params === null) {
            return 'searchCriteria=all';
        } else {
            if (this.storeVersion >= 2) {
                let paramObjKeys = Object.keys(params);
                let antiTrigger = ["filter_groups", "filterGroups", "sort_orders", "sortOrders", "page_size", "pageSize", "current_page", "currentPage"];
                let parserTrigger = paramObjKeys.filter(val => antiTrigger.includes(val));
                let operation = parserTrigger.length > 0 ? _transform_2 : _parser_2;
                return operation(params);
            } else {
                let operation = _transform_1;
                return operation(params);
            }
        }
    }

    /**
     * GET requests
     *
     * @param {String} endpoint
     * @param {Object} params
     *
     * @return {Promise}
     */
    get(endpoint, params) {
        endpoint = endpoint + '?' + this._searchTranslate(params);
        return this._formRequest('GET', endpoint);
    }

    /**
     * POST requests
     *
     * @param {String} endpoint
     * @param {Object} data
     *
     * @return {Promise}
     */
    post(endpoint, data) {
        return this._formRequest('POST', endpoint, data);
    }

    /**
     * PUT requests
     *
     * @param {String} endpoint
     * @param {Object} data
     *
     * @return {Promise}
     */
    put(endpoint, data) {
        return this._formRequest('PUT', endpoint, data);
    }

    /**
      * DELETE requests
      *
      * @param {String} endpoint
      * @param {Object}
      *
      * @return {Object}
      */
    delete(endpoint, data) {
        return this._formRequest('DELETE', endpoint, data);
    }
}

module.exports = MagentoRestAPI;