/**
 * TwitterAuthConfig
 */

export class TwitterAuthConfig {

    readonly consumerKey: string;
    readonly consumerSecret: string;
    readonly redirectUrl: string;

    constructor(consumerKey: string, consumerSecret: string, redirectUrl: string) {
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.redirectUrl = redirectUrl;
    }

}

module.exports = TwitterAuthConfig;
