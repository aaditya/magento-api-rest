const api = require("../index");

(async () => {
    let client = new api({
        url: "http://192.168.1.41/mg",
        consumerKey: "az94e3fex3cvssjy1p9putht9519aejs",
        consumerSecret: "ch1cao2mbliu4f68k1gt4qae5zezejsc",
        accessToken: "90kvvu6jili6lrgatpz2cv3faigoccox",
        tokenSecret: "g1rfdh9hsp89m811qdx78hk8c1rfupzt"
    })

    try {
        let orders = (await client.get("orders")).data;
        console.log(orders)
    } catch (err) {
        console.log(err);
    }
})()