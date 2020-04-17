"use strict";

import chai from 'chai';
import Magento from'./index';

describe('# Construct', function () {
    it('should throw an error if the url, consumerKey, consumerSecret, accessToken or accessTokenSecret are missing', function () {
        chai.expect(function () {
            new Magento();
        }).to.throw(Error);
    });

    it('should set the default options', function () {
        let client = new Magento({
            'url': 'http://magento.dev',
            'consumerKey': 'dummyConsumerKey',
            'consumerSecret': 'dummyConsumerSecret',
            'accessToken': 'dummyAccessToken',
            'tokenSecret': 'dummyTokenSecret'
        });

        chai.expect(client.url).to.equal('http://magento.dev');
        chai.expect(client.consumerKey).to.equal('dummyConsumerKey');
        chai.expect(client.consumerSecret).to.equal('dummyConsumerSecret');
        chai.expect(client.accessToken).to.equal('dummyAccessToken');
        chai.expect(client.tokenSecret).to.equal('dummyTokenSecret');
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

    it('should return full API url', function () {
        let endpoint = 'orders';
        let expected = client.url + '/rest/V1/orders';
        let url = client._formURL(endpoint);
        chai.expect(expected).to.eql(url);
    });
});