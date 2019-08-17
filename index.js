const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');
const _url = require('url');

const params_convert = require('./lib/param_url');

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

    if (!(options.accessTokenSecret)) {
        throw new Error('accessTokenSecret is required');
    }

    this.clientVersion = require('./package.json').version;
    this._setDefaults(options);
}

MagentoAPI.prototype._setDefaults = function (options) {
    this.url = options.url;
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.accessToken = options.accessToken;
    this.accessTokenSecret = options.accessTokenSecret;
    this.magentoVersion = options.magentoVersion || 'V1';
    this.isSsl = /^https/i.test(this.url);
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
        secret: this.accessTokenSecret
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
    return `${accessibleUrl}rest/${this.magentoVersion}/${endpoint}`;
}

MagentoAPI.prototype._request = function (request_data) {
    request_data.url = this._formURL(request_data.url);
    return axios({
        url: request_data.url,
        method: request_data.method,
        headers: {
            'Authorization': this._getOAuth(request_data).Authorization,
            'Content-Type': 'application/json'
        },
        body: request_data.body
    })
}

MagentoAPI.prototype.query = function (method, endpoint, options = {}) {
    if (method == 'GET') {
        if (options.params) {
            let param_str = params_convert(options.params);
            endpoint = endpoint.concat('?' + param_str);
        } else {
            endpoint = endpoint.concat('?searchCriteria=all');
        }
    }
    return this._request({
        method: method,
        url: endpoint,
        body: options.body
    })
}

module.exports = MagentoAPI;