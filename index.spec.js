"use strict";

import chai from 'chai';
import Magento from './index';
import moxios from 'moxios';

const expect = chai.expect;

describe('# Construct', function () {
    it('should throw an error if the url, consumerKey, consumerSecret, accessToken or accessTokenSecret are missing', function () {
        expect(function () {
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

        expect(client.url).to.equal('https://magento.dev');
        expect(client.consumerKey).to.equal('dummyConsumerKey');
        expect(client.consumerSecret).to.equal('dummyConsumerSecret');
        expect(client.accessToken).to.equal('dummyAccessToken');
        expect(client.tokenSecret).to.equal('dummyTokenSecret');
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

        expect(url).to.be.eql(expected);
    });
});

describe('# Requests', function () {
    const client = new Magento({
        'url': 'https://magento.dev',
        'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
        'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
    });

    it('should execute get requests without params', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.get('orders');
        
        expect(data).to.have.property('success').eql(true);
    });

    // it('should execute get requests with params', async function () {
    //     moxios.stubRequest('https://magento.dev/rest/V1/orders', {
    //         status: 200,
    //         response: {
    //             success: true,
    //             msg: "Hit the correct request."
    //         }
    //     });

    //     const { data } = await client.get('orders', { });
        
    //     expect(data).to.have.property('success').eql(true);
    // });

    it('should execute post requests', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.post('orders', {});
        
        expect(data).to.have.property('success').eql(true);
    });

    it('should execute put requests', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.put('orders');
        
        expect(data).to.have.property('success').eql(true);
    });

    it('should execute delete requests', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.delete('orders');
        
        expect(data).to.have.property('success').eql(true);
    });
});