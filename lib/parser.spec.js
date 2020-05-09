import chai from 'chai';
import parser from './parser';

const expect = chai.expect;

describe('# Parser Lib', function () {
    it('should render params object for AND query', function () {
        const params = {
            $from: "2019-08-03 11:22:47",
            $to: "2020-08-03 11:22:47",
            $sort: {
                "created_at": "desc"
            },
            $perPage: 200,
            $page: 1
        }

        const output = parser(params);

        const target = {
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

        expect(output).to.eql(target);
    });

    it('should render params object for AFTER query', function () {
        const params = {
            $after: "2019-08-03 11:22:47"
        }

        const output = parser(params);

        const target = {
            "filter_groups": [
                {
                    "filters": [
                        {
                            "field": "created_at",
                            "value": "2019-08-03 11:22:47",
                            "condition_type": "gt"
                        }
                    ]
                }
            ]
        }

        expect(output).to.eql(target);
    });

    it('should render params object for BEFORE query', function () {
        const params = {
            $before: "2019-08-03 11:22:47"
        }

        const output = parser(params);

        const target = {
            "filter_groups": [
                {
                    "filters": [
                        {
                            "field": "created_at",
                            "value": "2019-08-03 11:22:47",
                            "condition_type": "lt"
                        }
                    ]
                }
            ]
        }

        expect(output).to.eql(target);
    });

    it('should render params object for OR query', function () {
        const params = {
            $or: [
                { "sku": "TST-1" },
                { "sku": "TST-2" }
            ]
        }

        const output = parser(params);

        const target = {
            "filter_groups": [
                {
                    "filters": [
                        {
                            "field": "sku",
                            "value": "TST-1",
                            "condition_type": "eq"
                        },
                        {
                            "field": "sku",
                            "value": "TST-2",
                            "condition_type": "eq"
                        }
                    ]
                }
            ]
        }

        expect(output).to.eql(target);
    });

    it('should throw error for invalid from/to query', function () {
        const params = {
            $from: "2019-08-03 11:22:47"
        }

        expect(parser.bind(parser, params)).to.throw(Error);
    });

    it('should throw error for invalid operation key', function () {
        const params = {
            $null: null
        }

        expect(parser.bind(parser, params)).to.throw(Error);
    });

    it('should throw error for nested OR queries', function () {
        const params = {
            $or: {
                $or: {
                    $or: {

                    }
                }
            }
        }

        expect(parser.bind(parser, params)).to.throw(Error);
    });
});