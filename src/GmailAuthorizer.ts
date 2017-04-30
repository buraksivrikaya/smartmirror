/**
 * GmailAuthorizer
 */

const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;

export class GmailAuthorizer {

    readonly scopes;
    readonly gmailAuth;

    constructor(clientId: string, clientSecret: string, redirectUrl: string, scopes: string) {
        this.gmailAuth = new Oauth2(clientId, clientSecret, redirectUrl);
        this.scopes = scopes;
    }

    generateAuthUri(): string {
        return this.gmailAuth.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });
    }

    authorize(code: string) {
        let that = this;
        this.gmailAuth.getToken(code, function (error, tokens) {
            if (!error) {
                that.gmailAuth.setCredentials(tokens);
            } else {
                console.log("error");
            }
        });
    }

}

module.exports = GmailAuthorizer;
