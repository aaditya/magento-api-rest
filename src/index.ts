import axios from "axios"
import crypto from "crypto"
import OAuth from "oauth-1.0a"

class MagentoApi {
    private url: string
    private consumerKey: string
    private consumerSecret: string
    private accessToken: string
    private tokenSecret: string
    private magentoVersion: string | null | undefined

    /**
     * Constructor
     * @param params object
     */
    constructor(params: MagentoApiParams) {
        this.url = params.url
        this.consumerKey = params.consumerKey
        this.consumerSecret = params.consumerSecret
        this.accessToken = params.accessToken
        this.tokenSecret = params.tokenSecret
        this.magentoVersion = params.magentoVersion
    }

    /**
     * Parse an Object to queryString
     * @returns string
     */
    parseQueryString(obj: any, prefix: string | null = null): string {
        let str = [], p: any
        for (p in obj) {
            if (obj.hasOwnProperty(p)) {
                var k = prefix ? prefix + "[" + p + "]" : p,
                    v = obj[p]
                str.push((v !== null && typeof v === "object") ?
                    this.parseQueryString(v, k) :
                    k + "=" + v)
            }
        }
        return str.join("&")
    }

    /**
     * Get the headers for the request
     * @returns Header
     */
    getHeaders(url: string, method: "GET" | "POST" | "PUT" | "DELETE"): Header {
        // Initialize OAuth
        const oauth = new OAuth({
            consumer: {
                key: this.consumerKey,
                secret: this.consumerSecret,
            },
            signature_method: "HMAC-SHA256",
            hash_function(base_string, key) {
                return crypto
                    .createHmac("sha256", key)
                    .update(base_string)
                    .digest("base64")
            },
        })

        // Token (from your Magento installation)
        const token = {
            key: this.accessToken,
            secret: this.tokenSecret,
        }

        const requestData = {
            url,
            method
        }

        let header = {
            "Content-Type": "application/json"
        }

        const oauthHeader = oauth.toHeader(oauth.authorize(requestData, token))

        return {
            ...header,
            ...oauthHeader
        }
    }

    /**
     * Get the URL for the request
     * @returns string
     */
    getUrl(): string {
        const version = this.magentoVersion ? this.magentoVersion : "V1"

        return `${this.url}/rest/${version}/`
    }

    /**
     * Make a GET request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async get(path: string, data: any | null = null): Promise<any> {
        try {
            let url = `${this.getUrl()}${path}`

            if (data) {
                let params = {
                    searchCriteria: data
                }
                url += `?${this.parseQueryString(params)}`
                return await axios.get(url, {
                    headers: this.getHeaders(url, "GET") as any,
                })
            } else {
                return await axios.get(`${this.getUrl()}${path}`, {
                    headers: this.getHeaders(url, "GET") as any
                })
            }
        } catch (error: any) {
            console.error(error)
        }
    }

    /**
     * Make a POST request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async post(path: string, data: any): Promise<any> {
        try {
            const url = `${this.getUrl()}${path}`
            return await axios.post(url, data, {
                headers: this.getHeaders(url, "POST") as any
            })
        } catch (error: any) {
            console.error(error)
        }
    }

    /**
     * Make a PUT request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async put(path: string, data: any): Promise<any> {
        try {
            const url = `${this.getUrl()}${path}`
            return await axios.put(url, data, {
                headers: this.getHeaders(url, "PUT") as any
            })
        } catch (error: any) {
            console.error(error)
        }
    }

    /**
     * Make a DELETE request to the Magento API
     * @param path string
     * @returns Promise<any>
     */
    async delete(path: string): Promise<any> {
        try {
            const url = `${this.getUrl()}${path}`
            return await axios.delete(url, {
                headers: this.getHeaders(url, "DELETE") as any
            })
        } catch (error: any) {
            console.error(error)
        }
    }

    /**
     * Set the default values for the Magento API
     * @param params object
     */
    _setDefaults(params: MagentoApiParams) {
        this.url = params.url
        this.consumerKey = params.consumerKey
        this.consumerSecret = params.consumerSecret
        this.accessToken = params.accessToken
        this.tokenSecret = params.tokenSecret
        this.magentoVersion = params.magentoVersion
    }
}

interface Header {
    "Content-Type": string,
    "Authorization": string
}

interface MagentoApiParams {
    url: string,
    consumerKey: string,
    consumerSecret: string,
    accessToken: string,
    tokenSecret: string,
    magentoVersion?: string | null | undefined,
}

export default MagentoApi
