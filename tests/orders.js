const api = require("../index");

(async () => {
    try {
        let client = new api({
            url: "http://192.168.1.18/mg",
            consumerKey: "21b2898233e9fa57f880080ebe4c0b82",
            consumerSecret: "018968d0356f685351fa5c1110e9fcd7",
            accessToken: "ac3d24f18c5a50f955e4905a74475f54",
            tokenSecret: "1f02ba0da7599b3505c2650fdaa8c6d1",
            version: 1
        });

        let options = {
            "filter": [
                {
                    "attribute": "status",
                    // "neq": 3,
                    "in": ["processing"],
                    // "nin": [2, 3],
                    // "gt": 0,
                    // "lt": 3,
                    // "from": "this",
                    // "to": "this"
                }
            ],
            "page": 1,
            "order": "entity_id",
            "dir": "dsc",
            "limit": 100
        }
        
        let orders = (await client.get("orders", options).data);
        console.log(orders)
    } catch (err) {
        console.log(err);
    }
})()