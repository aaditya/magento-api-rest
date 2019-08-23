const urlify = require('./param_url');

const objectTransform = (obj, parent = false) => {
    let myOperators = ["$or", "$from", "$to", "$after", "$before"];
    let ignoreKeys = ["$sort", "$page", "$filter"]
    let filters = {}
    let partialFilters = [];
    if (((obj["$from"]) && (!obj["$to"])) || ((obj["$to"]) && (!obj["$from"]))) {
        throw new Error('"from" operator requires "to".');
    } else {
        let allFilters = [];
        for (key in obj) {
            if (key == "$sort") {
                let sortFilters = []
                for (key2 in obj[key]) {
                    let filter = {
                        "field": key2,
                        "direction": obj[key][key2]
                    };
                    sortFilters.push(filter)
                }
                filters.sortOrders = sortFilters;
            } else if (key == "$page") {
                filters.pageSize = obj[key];
            } else {
                let filter = {};
                if (myOperators.includes(key) && !ignoreKeys.includes(key)) {
                    if (key == "$or") {
                        if (!parent) {
                            if (obj[key].length) {
                                let temp_filters = [];
                                obj[key].map((o) => {
                                    let temp_filter = objectTransform(o, true);
                                    temp_filters.push(temp_filter);
                                });
                                filter = temp_filters;
                            } else {
                                filter = objectTransform(obj[key], true);
                            }
                        } else {
                            throw new Error('Cannot execute nested OR searches.')
                        }
                    } else if (key == "$from") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "from"
                        }
                    } else if (key == "$to") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "to"
                        }
                    } else if (key == "$after") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "gteq"
                        }
                    } else if (key == "$before") {
                        filter = {
                            "field": "created_at",
                            "value": obj[key].toString(),
                            "condition_type": "lteq"
                        }
                    }
                } else {
                    filter = {
                        "field": key,
                        "value": obj[key].toString(),
                        "condition_type": "eq"
                    }
                }
                // Handle Deep $or searches
                if (filter.length > 1) {
                    filter.forEach((f) => {
                        partialFilters.push(f);
                        allFilters.push({ "filters": [].concat(f) })
                    })
                } else {
                    partialFilters.push(filter);
                    allFilters.push({ "filters": [].concat(filter) })
                }
            }
        }

        if (parent) {
            return partialFilters;
        }

        filters.filter_groups = allFilters;
        return urlify(filters);
    }
}

module.exports = objectTransform;