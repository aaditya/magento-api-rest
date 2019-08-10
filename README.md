# Magento API REST - Node.js

A Node.js client wrapper to work with the Magento REST API. Interact with the API using this library. Still a work in progrss, if you end up using this library in your project, do contribute and help find issues which I may have missed.

[![dependencies Status](https://david-dm.org/aadityachakravarty/magento-api-rest/status.svg)](https://david-dm.org/aadityachakravarty/magento-api-rest)

## Installation

```
npm i magento-api-rest
```

## Getting started

Generate API credentials by following these instructions <https://devdocs.magento.com/guides/v2.3/get-started/create-integration.html>.

Make sure to check the resource access is as per your requirements to prevent misuse of the API Keys.

Check out the Magento API endpoints and data that can be manipulated in <https://devdocs.magento.com/redoc/2.3/index.html>.

## Setup

Setup for the new Magento REST API integration (Magento 2.0 or later):

```js
var MagentoAPI = require('magento-api-rest');

var client = new MagentoAPI({
    'url': 'http://www.test.com/index.php/rest',
    'consumerKey': '<OAuth 1.0a consumer key>',
    'consumerSecret': '<OAuth 1.0a consumer secret>',
    'accessToken': '<OAuth 1.0a access token>',
    'accessTokenSecret': '<OAuth 1.0a access token secret>'
})
```

### Options

| Option              | Type      | Required | Description                                                |
|---------------------|-----------|----------| -----------------------------------------------------------|
| `url`               | `String`  | yes      | Your Store URL, example: http://demo-acm-2.bird.eu         |
| `consumerKey`       | `String`  | yes      | Your API consumer key                                      |
| `consumerSecret`    | `String`  | yes      | Your API consumer secret                                   |
| `accessToken`       | `String`  | yes      | Your API Access Token                                      |
| `accessTokenSecret` | `String`  | yes      | Your API Access Token Secret                               |
| `version`           | `String`  | no       | Magento REST API version, default is `V1`                  |

## Methods

| Params             | Type       | Description                                                  |
|--------------------|------------|--------------------------------------------------------------|
| `method`           | `String`   | API Access method, example: `GET` or `POST`                  |
| `endpoint`         | `String`   | API Endpoint, example: `orders` or `products`                |
| `options.params`   | `object`   | Params object to send data as part of url, example below.    |
| `options.body`     | `object`   | Body object to send data to PUT/POST requests.               |

### QUERY

- `.query(method, endpoint, options)`

### API

Requests are made with [Axios library](https://github.com/axios/axios) with [support to promises](https://github.com/axios/axios#promises).

```js
var options = {
    "params": {
        "filter_groups": [
            {
                "filters": [
                    {
                        "field": "created_at",
                        "value": "2019-08-03 11:22:47",
                        "condition_type": "from"
                    },
                    {   
                        "field": "created_at",
                        "value": "2020-08-03 11:22:47",
                        "condition_type": "to"
                    }
                ]
            }
        ],
        "sortOrders": [
            {
                "field": "created_at",
                "direction": "desc"
            }
        ],
        "pageSize": 200
    },
    "body": {

    }
}
```
To get more information as to how to form queries natively, use the following reference,
<https://devdocs.magento.com/guides/v2.3/rest/performing-searches.html>.

If you want to use the above object in a request,
```js
function getOrders () {
   client.query('GET', 'orders', options).then((response) => {
    //  Response Handling
   }).catch((error) => {
    //  Error Handling
   })
}
```
or by async await,

```js
async function getOrders () {
    try {
        let response = await client.query('GET', 'orders', options);
        // Response Handling
    } catch (e) {
        // Error Handling
    }
}
```

## Release History

- 2019-08-10 - v1.0.0-4 - Added Test Cases and added information to README.
- 2019-08-10 - v1.0.0-3 - Miscellaneous Edits
- 2019-08-09 - v1.0.0-2 - Setup for axios and OAuth.
- 2019-08-08 - v1.0.0 - Initial Release.
