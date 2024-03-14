import { default as MagentoApi } from "../../src/index";

(async () => {
    let client = new MagentoApi({
        url: "baseUrl",
        consumerKey: "customerKey",
        consumerSecret: "consumerSecret",
        accessToken: "accessToken",
        tokenSecret: "tokenSecret",
        magentoVersion: "V1"
    })

    let params = {
        "filter_groups": [{
            "filters": [{
                "field": "created_at",
                "value": "2024-03-12 0:00:00",
                "condition_type": "gteq"
            }]
        }],
        "sortOrders": [{
            "field": "entity_id",
            "direction": "asc"
        }]
    }

    try {
        let response = await client.get("customers/search", params)
        console.log(JSON.stringify(response.data))
    } catch (e) {
        console.log(e)
    }
})()
