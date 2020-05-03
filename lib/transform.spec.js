import chai from 'chai';
import transform from './transform';

const expect = chai.expect;

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

describe('# Transform Lib', function () {
    it('should render params object', function () {
        const output = transform(params);

        const expected = 'searchCriteria[filter_groups][0][filters][0][field]=created_at&searchCriteria[filter_groups][0][filters][0][value]=2019-08-03 11:22:47&searchCriteria[filter_groups][0][filters][0][condition_type]=from&searchCriteria[filter_groups][1][filters][0][field]=created_at&searchCriteria[filter_groups][1][filters][0][value]=2020-08-03 11:22:47&searchCriteria[filter_groups][1][filters][0][condition_type]=to&searchCriteria[sort_orders][0][field]=created_at&searchCriteria[sort_orders][0][direction]=desc&searchCriteria[page_size]=200&searchCriteria[current_page]=1';

        expect(output).to.eql(expected);
    });
});