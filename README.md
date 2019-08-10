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
| `url`               | `String`  | yes      | Your Store URL, example: http://magento.dev/               |
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
| `options.params`   | `object`   | Refer to demo/search_query_object.json for example.          |
| `options.body`     | `object`   | Body object to send data to PUT/POST requests.               |

### QUERY

- `.query(method, endpoint, options)`

### API

This package uses axios to access the APIs, so every request uses Promises by default.

```js
function getOrders () {
   client.query('GET', 'orders').then((response) => {
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
        let response = await client.query('GET', 'orders');
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
