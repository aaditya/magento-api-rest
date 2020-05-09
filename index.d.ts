import * as OAuth from 'oauth-1.0a'

export declare type MagentoRestApiVersion =
    | 'V1'
    | 'async/V1'
    | 'async/bulk/V1'

export declare type MagentoRestApiMethod =
    | 'get'
    | 'post'
    | 'put'
    | 'delete'

export interface IMagentoRestApiOptions {
    /* Your Store URL, example: http://magento.dev/ */
    url: string
    /* Your API consumer key */
    consumerKey: string
    /* 	Your API consumer secret */
    consumerSecret: string
    /*    Your API Access Token   */
    accessToken: string
    /*    Your API Access Token Secret  */
    tokenSecret: string
    /*    Your API Endpoint   */
    type?: string
    /*  Your API SHA Version    */
    sha?: number
    /* Define the request timeout */
    timeout?: number
    /* Define the custom Axios config, also override this library options */
    axiosConfig?: any
}

/**
 * Magento REST API wrapper
 *
 * @param {Object} opt
 */
export default class MagentoRestApi {
    protected url: string
    protected consumerKey: string
    protected consumerSecret: string
    protected accessToken: string
    protected tokenSecret: string
    protected endpointType: MagentoRestApiVersion
    protected shaVersion: string
    protected timeout: number
    protected axiosConfig: any

    /**
     * Class constructor.
     *
     * @param {Object} opt
     */
    constructor(opt: IMagentoRestApiOptions | MagentoRestApi)

    /**
     * Set default options
     *
     * @param {Object} opt
     */
    private _setDefaults(opt: IMagentoRestApiOptions): void

    /**
     * Normalize query string for oAuth
     *
     * @param  {String} url
     * @param  {Object} params
     *
     * @return {String}
     */
    private _normalizeQueryString(url: string, params: any): string

    /**
     * @return {Object}
     */
    private _getSHAType(): object

    /**
     * Get URL
     *
     * @param  {String} endpoint
     *
     * @return {String}
     */
    private _formURL(endpoint: string): string

    /**
     * Get OAuth
     *
     * @return {Object}
     */
    private _getOAuth(): OAuth

    /**
     * Do requests
     *
     * @param  {String} method
     * @param  {String} endpoint
     * @param  {Object} data
     *
     * @return {Object}
     */
    private _formRequest(
        method: MagentoRestApiMethod,
        endpoint: string,
        data: any
    ): Promise<any>

    /**
     * Search Translation for query strings
     * 
     * @param {Object} params
     * 
     * @return {Object}
     */
    private _searchTranslate(params:any): any

    /**
     * GET requests
     *
     * @param  {String} endpoint
     * @param  {Object} params
     *
     * @return {Object}
     */
    public get(endpoint: string): Promise<any>
    public get(endpoint: string, params: any): Promise<any>

    /**
     * POST requests
     *
     * @param  {String} endpoint
     * @param  {Object} data
     *
     * @return {Object}
     */
    public post(endpoint: string, data: any): Promise<any>

    /**
     * PUT requests
     *
     * @param  {String} endpoint
     * @param  {Object} data
     *
     * @return {Object}
     */
    public put(endpoint: string, data: any): Promise<any>

    /**
     * DELETE requests
     *
     * @param  {String} endpoint
     *
     * @return {Object}
     */
    public delete(endpoint: string): Promise<any>
}
