/**
 * GmailAuthorizer
 */

const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;
const express = require("express");
const Promise = require("promise");

export class GmailAuthorizer {

    private readonly scopes: string;
    private readonly reditectUrl: string;
    private readonly clientId: string;
    private readonly clientSecret: string;
    private readonly gmailAuth;
    private readonly server;

    constructor(clientId: string, clientSecret: string, redirectUrl: string, scopes: string) {
        this.gmailAuth = new Oauth2(clientId, clientSecret, redirectUrl);
        this.scopes = scopes;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.reditectUrl = redirectUrl;
        this.server = express();
    }

    // TODO change redirect page to a html page indicating authorization is done
    listenForRequest(url: string, port: number, callback: Function) {
        let that = this;
        this.server.get(url, function (request, response) {
            response.redirect(that.generateAuthUri());
        });
        this.server.get(this.reditectUrl.substr(this.reditectUrl.lastIndexOf("/")), function (request, response) {
            let auth = new Oauth2(that.clientId, that.clientSecret, that.reditectUrl);
            GmailAuthorizer.authorize(auth, request.query.code).then(function(auth) {
                callback(auth);
                response.redirect("http://www.google.com");
            });
        });
        this.server.listen(port);
    }

    private generateAuthUri(): string {
        return this.gmailAuth.generateAuthUrl({
            access_type: "offline",
            scope: this.scopes
        });
    }

    private static authorize(auth, code: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            auth.getToken(code, function (error, tokens) {
                if (!error) {
                    auth.setCredentials(tokens);
                    resolve(auth)
                } else {
                    console.log("error");
                    reject(error);
                }
            });
        });
    }

}

module.exports = GmailAuthorizer;
