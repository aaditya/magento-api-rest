import { default as MagentoApi } from "../../../src/index";

(async () => {
    let client = new MagentoApi({
        "url": "",
        "consumerKey": "",
        "consumerSecret": "",
        "accessToken": "",
        "tokenSecret": ""
    })

    let sku = "65-813"

    try {
        let response = await client.get(`products/${sku}`)
        console.log(JSON.stringify(response.data))
    } catch (e) {
        console.log(e)
    }
})()
