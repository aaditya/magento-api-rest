import axios from 'axios';

class MagentoApi {
    private url: string;
    private consumerKey: string;
    private consumerSecret: string;
    private accessToken: string;
    private tokenSecret: string;

    /**
     * Constructor
     * @param params object
     */
    constructor(params:{
        url: string,
        consumerKey: string,
        consumerSecret: string,
        accessToken: string,
        tokenSecret: string,
    }) {
        this.url = params.url;
        this.consumerKey = params.consumerKey;
        this.consumerSecret = params.consumerSecret;
        this.accessToken = params.accessToken;
        this.tokenSecret = params.tokenSecret;
    }

    /**
     * Get the headers for the request
     * @returns Header
     */
    getHeaders(): Header {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.accessToken}`
        }
    }

    /**
     * Get the URL for the request
     * @returns string
     */
    getUrl(): string {
        return `${this.url}/rest/V1/`;
    }

    /**
     * Make a GET request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async get (path: string, data: any|null = null): Promise<any> {
        try {
            if (data) {
                return await axios.get(`${this.getUrl()}${path}`, {
                    headers: this.getHeaders() as any,
                    params: data
                });
            } else {
                return await axios.get(`${this.getUrl()}${path}`, {
                    headers: this.getHeaders() as any
                });
            }
        } catch (error:any) {
            console.error(error);
        }
    }

    /**
     * Make a POST request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async post (path: string, data: any): Promise<any> {
        try {
            return await axios.post(`${this.getUrl()}${path}`, data, {
                headers: this.getHeaders() as any
            });
        } catch (error:any) {
            console.error(error);
        }
    }

    /**
     * Make a PUT request to the Magento API
     * @param path string
     * @param data any
     * @returns Promise<any>
     */
    async put (path: string, data: any): Promise<any> {
        try {
            return await axios.put(`${this.getUrl()}${path}`, data, {
                headers: this.getHeaders() as any
            });
        } catch (error:any) {
            console.error(error);
        }
    }

    /**
     * Make a DELETE request to the Magento API
     * @param path string
     * @returns Promise<any>
     */
    async delete (path: string): Promise<any> {
        try {
            return await axios.delete(`${this.getUrl()}${path}`, {
                headers: this.getHeaders() as any
            });
        } catch (error:any) {
            console.error(error);
        }
    }
}

interface Header {
    'Content-Type': string,
    'Authorization': string
}

export default MagentoApi;
