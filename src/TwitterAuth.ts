/**
 * TwitterAuth
 */

export class TwitterAuth {

    readonly consumerKey: string;
    readonly consumerSecret: string;
    readonly accessToken: string;
    readonly accessTokenSecret: string;

    constructor(consumerKey: string, consumerSecret: string, accessToken: string, accessTokenSecret: string) {
        this.consumerKey = consumerKey;
        this.consumerSecret = consumerSecret;
        this.accessToken = accessToken;
        this.accessTokenSecret = accessTokenSecret;
    }

}

module.exports = TwitterAuth;
