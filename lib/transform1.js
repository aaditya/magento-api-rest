const formFiters = (obj) => {
    let str = [];
    for (let key in obj) {
        if (Array.isArray(obj[key])) {
            obj[key].forEach((item, index) => {
                for (let key2 in item) {
                    if (Array.isArray(item[key2])) {
                        item[key2].forEach((item2, index2) => {
                            let formStr = `${key}[${index}][${key2}][${index2}]=${item2}`;
                            str.push(formStr);
                        });
                    } else {
                        let formStr = `${key}[${index}][${key2}]=${item[key2]}`;
                        str.push(formStr);
                    }
                }
            });
        } else {
            let directStr = `${key}=${obj[key]}`;
            str.push(directStr);
        }
    }
    return str.join("&");
}

module.exports = formFiters;