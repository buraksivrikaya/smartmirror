/**
 * GmailAuthConfig
 */

export class GmailAuthConfig {

    readonly clientId: string;
    readonly clientSecret: string;
    readonly redirectUrl: string;
    readonly scopes;

    constructor(clientId: string, clientSecret: string, redirectUrl: string, scopes: string) {
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUrl = redirectUrl;
        this.scopes = scopes;
    }

}

module.exports = GmailAuthConfig;
