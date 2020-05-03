const filterify = (obj) => {
    let str = [];
    for (let k in obj) {
        if (Array.isArray(obj[k])) {
            obj[k].forEach((item, index) => {
                for (let key in item) {
                    if (typeof item[key] == 'object' && item[key].length > 0) {
                        item[key].forEach((item2, index2) => {
                            for (let key2 in item2) {
                                let finalStr = `searchCriteria[${k}][${index}][${key}][${index2}][${key2}]=${item2[key2]}`
                                str.push(finalStr);
                            }
                        })
                    } else {
                        let finalStr = `searchCriteria[${k}][${index}][${key}]=${item[key]}`;
                        str.push(finalStr);
                    }
                }
            })
        } else {
            let finalStr = `searchCriteria[${k}]=${obj[k]}`;
            str.push(finalStr);
        }
    }
    return str.join('&');
}

module.exports = filterify;