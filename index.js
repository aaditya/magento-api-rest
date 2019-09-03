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
    this.magentoVersion = options.magentoVersion || 'V1';
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
    if (-1 === url.indexOf('?')) {
        return url;
    }

    var query = _url.parse(url, true).query;
    var params = [];
    var queryString = '';

    for (var p in query) {
        params.push(p);
    }
    params.sort();

    for (var i in params) {
        if (queryString.length) {
            queryString += '&';
        }

        queryString += encodeURIComponent(params[i]).replace(/%5B/g, '[')
            .replace(/%5D/g, ']');
        queryString += '=';
        queryString += encodeURIComponent(query[params[i]]);
    }

    return url.split('?')[0] + '?' + queryString;
};

MagentoAPI.prototype._getOAuth = function (request_data) {
    var oauth = OAuth({
        consumer: {
            key: this.consumerKey,
            secret: this.consumerSecret
        },
        signature_method: 'HMAC-SHA256',
        hash_function(base_string, key) {
            return crypto
                .createHmac('sha256', key)
                .update(base_string)
                .digest('base64')
        }
    });
    var token = {
        key: this.accessToken,
        secret: this.tokenSecret
    };
    return oauth.toHeader(oauth.authorize(request_data, token))
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
    return accessibleUrl + 'rest/' + this.magentoVersion + '/' + endpoint;
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
    let keys = Object.keys(params);
    let antiTrigger = ["filter_groups", "filterGroups", "sort_orders", "sortOrders", "page_size", "pageSize"]
    let parserTrigger = keys.filter(val => antiTrigger.includes(val));

    if (params || params != null) {
        let param_str = parserTrigger.length > 0 ? params_url : params_convert;
        return param_str(params);
    } else {
        return 'searchCriteria=all';
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

/**
 * OPTIONS requests
 *
 * @param  {String} endpoint
 * @param  {Object} params
 *
 * @return {Object}
 */
MagentoAPI.prototype.options = function (endpoint) {
    return this._request('OPTIONS', endpoint, null);
}

module.exports = MagentoAPI;