const crypto = require('crypto');
const OAuth = require('oauth-1.0a');
const axios = require('axios');

const params_convert = require('./lib/url_query');

function MagentoAPI(options) {
    this.url = options.url;
    this.consumerKey = options.consumerKey;
    this.consumerSecret = options.consumerSecret;
    this.accessToken = options.accessToken;
    this.accessTokenSecret = options.accessTokenSecret;
    this.magentoVersion = options.magentoVersion || 'V1';
}

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

MagentoAPI.prototype._formURL = function (endpoint) {
    let normalizeURL = this.url.split(-1) == '/' ? this.url : this.url + '/';
    return `${normalizeURL}rest/${this.magentoVersion}/${endpoint}`;
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

MagentoAPI.prototype.query = function (method, endpoint, params, body) {
    if (params) {
        let param_str = params_convert(params);
        endpoint = endpoint.concat('?' + param_str);
    } else {
        body = params;
        endpoint = endpoint.concat('?searchCriteria=all')
    }
    return this._request({
        method: method,
        url: endpoint,
        body: body
    })
}

module.exports = MagentoAPI;