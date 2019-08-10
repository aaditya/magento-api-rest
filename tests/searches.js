exports.or_search = {
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
    ]
}

exports.and_search = {
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
    ]
}

exports.combined_search = {
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
        },
        {
            "filters": [
                {
                    "field": "created_at",
                    "value": "2020-08-03 11:22:47",
                    "condition_type": "to"
                },
                {
                    "field": "created_at",
                    "value": "2019-08-03 11:22:47",
                    "condition_type": "from"
                }
            ]
        }
    ]
}