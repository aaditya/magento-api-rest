# Magento API REST

A Node.js client wrapper to work with the Magento REST API.

[![npm version](https://badge.fury.io/js/magento-api-rest.svg)](https://www.npmjs.com/package/magento-api-rest)
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

* Note: Magento 2.2 is also compatible with this package however some APIs from 2.3 don't exist in 2.2.

Setup for the new Magento REST API integration (Magento 2.3 or later):

```js
var MagentoAPI = require('magento-api-rest');

var client = new MagentoAPI({
    'url': 'http://www.test.com/index.php/rest',
    'consumerKey': '<OAuth 1.0a consumer key>',
    'consumerSecret': '<OAuth 1.0a consumer secret>',
    'accessToken': '<OAuth 1.0a access token>',
    'tokenSecret': '<OAuth 1.0a token secret>'
})
```

### Options

| Option              | Type      | Required | Description                                                |
|---------------------|-----------|----------| -----------------------------------------------------------|
| `url`               | `String`  | yes      | Your Store URL, example: http://demo-acm-2.bird.eu         |
| `consumerKey`       | `String`  | yes      | Your API consumer key                                      |
| `consumerSecret`    | `String`  | yes      | Your API consumer secret                                   |
| `accessToken`       | `String`  | yes      | Your API Access Token                                      |
| `tokenSecret`       | `String`  | yes      | Your API Access Token Secret                               |
| `version`           | `String`  | no       | Magento REST API version, default is `V1`                  |

## Methods

### GET

- `.get(endpoint)`
- `.get(endpoint, params)`

| Params     | Type     | Description                                                   |
|------------|----------|---------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, example: `orders`                       |
| `params`   | `Object` | Query strings params                                          |

### POST

- `.post(endpoint, data)`

| Params     | Type     | Description                                                 |
|------------|----------|-------------------------------------------------------------|
| `endpoint` | `String` | Magento API endpoint, `shipments`                           |
| `data`     | `Object` | JSON object to be sent as body.                             |

### QUERY

- `.query(method, endpoint, options)`

| Params             | Type       | Description                                                  |
|--------------------|------------|--------------------------------------------------------------|
| `method`           | `String`   | API Access method, example: `GET` or `POST`                  |
| `endpoint`         | `String`   | API Endpoint, example: `orders` or `products`                |
| `options.params`   | `object`   | Params object to send data as part of url, example below.    |
| `options.body`     | `object`   | Body object to send data to PUT/POST requests.               |

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
                    }
                ],
                "filters": [
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

## Build History

- 2019-08-22 - v1.0.0-6 - Fixed Post APIs body and partially added separate rest functions.
- 2019-08-10 - v1.0.0-5 - Added Experimental Parser
- 2019-08-10 - v1.0.0-4 - Added Test Cases and added information to README.
- 2019-08-10 - v1.0.0-3 - Miscellaneous Edits
- 2019-08-09 - v1.0.0-2 - Setup for axios and OAuth.
- 2019-08-08 - v1.0.0-1 - Initial API Setup.

## To Do

* Set up a demo store.
* Add test cases and write current ones correctly.
* Add other rest functions as per magento docs.
* Set up the Search Parser