const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const _url = require('url');

const params_convert = require('./lib/param_parser');
const params_url = require('./lib/param_url');

function MagentoAPI(options) {
    if (!(this instanceof MagentoAPI)) {
        return new MagentoAPI(options);
    }

    options = options || {};

    if (!(options.url)) {
        throw new Error('url is required');
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

MagentoAPI.prototype._setDefaults = function (options) {
    this.url = options.url;
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.accessToken = options.accessToken;
    this.tokenSecret = options.tokenSecret;
    this.magentoVersion = options.version || 'V1';
    this.storeVersion = options.store || 2;
    this.isSsl = /^https:\/\//i.test(this.url);
}

/**
 * Normalize query string for oAuth
 *
 * @param  {string} url
 * @return {string}
 */
MagentoAPI.prototype._normalizeQueryString = function (url) {
    // Exit if don't find query string
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
};

MagentoAPI.prototype._getOAuth = function (request_data) {
    let hmacVersion = this.storeVersion >= 2 ? "sha256" : "sha1";
    let oauth = OAuth({
        consumer: {
            key: this.consumerKey,
            secret: this.consumerSecret
        },
        signature_method: this.storeVersion >= 2 ? 'HMAC-SHA256' : 'HMAC-SHA1',
        hash_function(base_string, key) {
            return crypto
                .createHmac(hmacVersion, key)
                .update(base_string)
                .digest('base64')
        }
    });
    let token = {
        key: this.accessToken,
        secret: this.tokenSecret
    };
    return oauth.toHeader(oauth.authorize(request_data, token));
}

/**
 * Form the full url to call
 * @param {string} endpoint
 */
MagentoAPI.prototype._formURL = function (endpoint) {
    let accessibleUrl = this.url.split(-1) == '/' ? this.url : this.url + '/';
    if (!this.isSsl) {
        endpoint = this._normalizeQueryString(endpoint);
    }
    if (this.storeVersion < 2) {
        return accessibleUrl + 'api/rest/' + endpoint;
    } else {
        return accessibleUrl + 'rest/' + this.magentoVersion + '/' + endpoint;
    }
}

MagentoAPI.prototype._request = function (method, endpoint, body) {
    let request_data = {
        method: method,
        url: this._formURL(endpoint),
        body: body
    }
    return axios({
        method: method,
        url: request_data.url,
        headers: {
            'Authorization': this._getOAuth(request_data).Authorization,
            'Content-Type': 'application/json'
        },
        data: body
    })
}

/**
 * Search Parameter Translator
 */
MagentoAPI.prototype._searches = function (params) {
    if (!params || params === null) {
        return 'searchCriteria=all';
    } else {
        let paramObjKeys = Object.keys(params);
        let antiTrigger = ["filter_groups", "filterGroups", "sort_orders", "sortOrders", "page_size", "pageSize", "current_page", "currentPage"];
        let parserTrigger = paramObjKeys.filter(val => antiTrigger.includes(val));
        let param_str = parserTrigger.length > 0 ? params_url : params_convert;
        return param_str(params);
    }
}

/**
 * GET requests
 *
 * @param  {String} endpoint
 * @param  {Object} params
 *
 * @return {Promise}
 */
MagentoAPI.prototype.get = function (endpoint, params) {
    endpoint = endpoint + '?' + this._searches(params);
    return this._request('GET', endpoint);
}

/**
 * POST requests
 *
 * @param  {String} endpoint
 * @param  {Object} data
 *
 * @return {Promise}
 */
MagentoAPI.prototype.post = function (endpoint, data) {
    return this._request('POST', endpoint, data);
}

/**
 * PUT requests
 *
 * @param  {String} endpoint
 * @param  {Object} data
 * @param  {Object} params
 *
 * @return {Object}
 */
MagentoAPI.prototype.put = function (endpoint, data) {
    return this._request('PUT', endpoint, data);
}

/**
  * DELETE requests
  *
  * @param  {String} endpoint
  * @param  {Object} params
  * @param  {Object} params
  *
  * @return {Object}
  */
MagentoAPI.prototype.delete = function (endpoint) {
    return this._request('DELETE', endpoint, null);
}

module.exports = MagentoAPI;