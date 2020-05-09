"use strict";

import chai from 'chai';
import Magento from './index';
import moxios from 'moxios';

const expect = chai.expect;

describe('# Construct', function () {
    it('should throw an error if the required fields are missing or sha is invalid', function () {
        expect(function () {
            new Magento();
        }).to.throw(Error);
        expect(function () {
            new Magento({
                'url': 'https://magento.dev'
            });
        }).to.throw(Error);

        expect(function () {
            new Magento({
                'url': 'https://magento.dev',
                'consumerKey': 'dummyConsumerKey'
            });
        }).to.throw(Error);

        expect(function () {
            new Magento({
                'url': 'https://magento.dev',
                'consumerKey': 'dummyConsumerKey',
                'consumerSecret': 'dummyConsumerSecret'
            });
        }).to.throw(Error);

        expect(function () {
            new Magento({
                'url': 'https://magento.dev',
                'consumerKey': 'dummyConsumerKey',
                'consumerSecret': 'dummyConsumerSecret',
                'accessToken': 'dummyAccessToken',
            });
        }).to.throw(Error);

        expect(function () {
            new Magento({
                'url': 'https://magento.dev',
                'consumerKey': 'dummyConsumerKey',
                'consumerSecret': 'dummyConsumerSecret',
                'accessToken': 'dummyAccessToken',
                'tokenSecret': 'dummyTokenSecret'
            });
        }).to.not.throw(Error);
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

    it("_normalizeQueryString should return query string sorted by name", () => {
        const url = "https://magento.dev/rest/V1/products?filter[s]=Data+Search&fields=id&filter[limit]=10";
        const expected = "https://magento.dev/rest/V1/products?filter[s]=Data%20Search&fields=id&filter[limit]=10";
        const normalized = client._normalizeQueryString(url);

        expect(normalized).to.be.eql(expected);
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

    it('should execute get requests without params non https', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders?searchCriteria', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.get('orders');

        expect(data).to.have.property('success').eql(true);
    });

    it('should execute get requests without params', async function () {
        const clientLocal = new Magento({
            'url': 'http://magento.dev',
            'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        });

        moxios.stubRequest('http://magento.dev/rest/V1/orders?searchCriteria=', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await clientLocal.get('orders');

        expect(data).to.have.property('success').eql(true);
    });

    it('should execute get requests without params with url ending in "/"', async function () {
        const clientLocal = new Magento({
            'url': 'http://magento.dev/',
            'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
        });

        moxios.stubRequest('http://magento.dev/rest/V1/orders?searchCriteria=', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await clientLocal.get('orders');

        expect(data).to.have.property('success').eql(true);
    });

    it('should execute get requests with empty object params https', async function () {
        moxios.stubRequest('https://magento.dev/rest/V1/orders?searchCriteria', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.get('orders', {});

        expect(data).to.have.property('success').eql(true);
    });
    

    it('should reject for invalid sha version', async function () {
        const clientSecond = new Magento({
            'url': 'https://magento.dev',
            'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'sha': 'xxx'
        });

        expect(function () {
            clientSecond.get('orders');
        }).to.throw(Error);
    });

    it('should execute request for sha256 version', async function () {
        const clientSecond = new Magento({
            'url': 'https://magento.dev',
            'consumerKey': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'consumerSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'accessToken': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'tokenSecret': 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
            'sha': 256
        });

        moxios.stubRequest('https://magento.dev/rest/V1/orders?searchCriteria', {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await clientSecond.get('orders');

        expect(data).to.have.property('success').eql(true);
    });

    it('should execute get requests with params', async function () {
        const params = {
            "filter_groups": [
                {
                    "filters": [
                        {
                            "field": "created_at",
                            "value": "2019-08-03 11:22:47",
                            "condition_type": "from"
                        }
                    ]
                },
                {
                    "filters": [
                        {
                            "field": "created_at",
                            "value": "2020-08-03 11:22:47",
                            "condition_type": "to"
                        }
                    ]
                }
            ],
            "sort_orders": [
                {
                    "field": "created_at",
                    "direction": "desc"
                }
            ],
            "page_size": 200,
            "current_page": 1
        }

        let endpoint = 'orders?searchCriteria[filter_groups][0][filters][0][field]=created_at&searchCriteria[filter_groups][0][filters][0][value]=2019-08-03 11:22:47&searchCriteria[filter_groups][0][filters][0][condition_type]=from&searchCriteria[filter_groups][1][filters][0][field]=created_at&searchCriteria[filter_groups][1][filters][0][value]=2020-08-03 11:22:47&searchCriteria[filter_groups][1][filters][0][condition_type]=to&searchCriteria[sort_orders][0][field]=created_at&searchCriteria[sort_orders][0][direction]=desc&searchCriteria[page_size]=200&searchCriteria[current_page]=1';

        moxios.stubRequest(`https://magento.dev/rest/V1/${endpoint}`, {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.get('orders', params);

        expect(data).to.have.property('success').eql(true);
    });

    it('should execute get requests with parser params', async function () {
        const params = {
            $from: "2019-08-03 11:22:47",
            $to: "2020-08-03 11:22:47",
            $sort: {
                "created_at": "desc"
            },
            $perPage: 200,
            $page: 1
        }

        let endpoint = 'orders?searchCriteria[sort_orders][0][field]=created_at&searchCriteria[sort_orders][0][direction]=desc&searchCriteria[page_size]=200&searchCriteria[current_page]=1&searchCriteria[filter_groups][0][filters][0][field]=created_at&searchCriteria[filter_groups][0][filters][0][value]=2019-08-03 11:22:47&searchCriteria[filter_groups][0][filters][0][condition_type]=from&searchCriteria[filter_groups][1][filters][0][field]=created_at&searchCriteria[filter_groups][1][filters][0][value]=2020-08-03 11:22:47&searchCriteria[filter_groups][1][filters][0][condition_type]=to';

        moxios.stubRequest(`https://magento.dev/rest/V1/${endpoint}`, {
            status: 200,
            response: {
                success: true,
                msg: "Hit the correct request."
            }
        });

        const { data } = await client.get('orders', params);

        expect(data).to.have.property('success').eql(true);
    });

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