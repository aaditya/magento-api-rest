var Magento = require('../index.js');
var chai = require('chai');
var nock = require('nock');

describe('#Construct', function () {
    it('should throw an error if the url, consumerKey, consumerSecret, accessToken or accessTokenSecret are missing', function () {
        chai.expect(function () {
            new Magento();
        }).to.throw(Error);
    });

    it('should set the default options', function () {
        var client = new Magento({
            'url': 'http://www.test.com',
            'consumerKey': '<OAuth 1.0a consumer key>',
            'consumerSecret': '<OAuth 1.0a consumer secret>',
            'accessToken': '<OAuth 1.0a access token>',
            'tokenSecret': '<OAuth 1.0a access token secret>',
            'magentoVersion': 'V1'
        });

        chai.expect(client.magentoVersion).to.equal('V1');
    });
});

describe('#Requests', function () {
    beforeEach(function () {
        nock.cleanAll();
    });

    // var client = new Magento();

    // it('should return full API url', function () {
    //     var endpoint = 'orders';
    //     var expected = demo_credentials.url + '/rest/V1/orders';
    //     var url = client._formURL(endpoint);

    //     chai.assert.equal(url, expected);
    // });

    // it('should return content for get requests', function (done) {
    //     this.timeout(20000);
    //     client.query('GET', 'orders').then((response) => {
    //         chai.expect(response.data).to.be.an.object;
    //         done();
    //     }).catch((err) => {
    //         chai.expect(err).to.exist;
    //         done();
    //     })
    // });

    // it('should match params object in request and response', function (done) {
    //     this.timeout(20000);
    //     let params = require('./searches').combined_search;
    //     client.query('GET', 'orders', { params: params }).then((response) => {
    //         chai.expect(response.data.search_criteria).to.eql(params);
    //         done();
    //     }).catch((err) => {
    //         chai.expect(err).to.exist;
    //         done();
    //     })
    // });
});