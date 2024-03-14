import { default as MagentoApi } from "../../src/index";

(async () => {
    let client = new MagentoApi({
        url: "https://portal.satco.com/",
        consumerKey: "",
        consumerSecret: "",
        accessToken: "",
        tokenSecret: "",
        magentoVersion: "async/V1"
    })

    let data = [
        {"sku":"96-323","source_code":"10","quantity":0,"status":0}
    ]

    try {
        let response = await client.post("inventory/source-items", {
            "sourceItems": data
        })
        console.log(JSON.stringify(response.data))
    } catch (e) {
        console.log(e)
    }
})()
