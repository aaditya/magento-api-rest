"use strict";

import chai from 'chai';
import Magento from './index';

describe('# Construct', function () {
    it('should throw an error if the url, consumerKey, consumerSecret, accessToken or accessTokenSecret are missing', function () {
        chai.expect(function () {
            new Magento();
        }).to.throw(Error);
    });

    it('should set the default options', function () {
        let client = new Magento({
            'url': 'https://magento.dev',
            'consumerKey': 'dummyConsumerKey',
            'consumerSecret': 'dummyConsumerSecret',
            'accessToken': 'dummyAccessToken',
            'tokenSecret': 'dummyTokenSecret'
        });

        chai.expect(client.url).to.equal('https://magento.dev');
        chai.expect(client.consumerKey).to.equal('dummyConsumerKey');
        chai.expect(client.consumerSecret).to.equal('dummyConsumerSecret');
        chai.expect(client.accessToken).to.equal('dummyAccessToken');
        chai.expect(client.tokenSecret).to.equal('dummyTokenSecret');
    });
});

describe("# Methods", function () {
    const client = new Magento({
        'url': 'https://magento.dev',
        'consumerKey': 'dummyConsumerKey',
        'consumerSecret': 'dummyConsumerSecret',
        'accessToken': 'dummyAccessToken',
        'tokenSecret': 'dummyTokenSecret'
    });

    it("_formUrl should return full endpoint URL", function () {
        const endpoint = "products";
        const expected = "https://magento.dev/rest/V1/" + endpoint;
        const url = client._formURL(endpoint);

        chai.expect(url).to.be.eql(expected);
    });
});

describe('# Requests', function () {
    const client = new Magento({
        'url': 'http://magento.dev',
        'consumerKey': 'dummyConsumerKey',
        'consumerSecret': 'dummyConsumerSecret',
        'accessToken': 'dummyAccessToken',
        'tokenSecret': 'dummyTokenSecret'
    });

    it('should execute get requests', async function () {
        const { data } = await client.get('orders');
        console.log(data)
    });
});