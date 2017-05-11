/**
 * Authorizer
 */

import { GmailAuthConfig } from "./GmailAuthConfig";
import { TwitterAuthConfig } from "./TwitterAuthConfig";
const TwitterAuth = require("./TwitterAuth.js");
const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;
const express = require("express");
const cookieParser = require("cookie-parser");
const Promise = require("promise");
const OAuth = require("oauth").OAuth;

export class Authorizer {

    private static gmailConfig: GmailAuthConfig;
    private static gmailUrl: string;
    private static gmailCallback: Function;

    private static twitterConfig: TwitterAuthConfig;
    private static twitterUrl: string;
    private static twitterCallback: Function;

    private static readonly server = express();

    public static registerGmailAuthOn(authConfig: GmailAuthConfig, url: string, callback: Function) {
        this.gmailConfig = authConfig;
        this.gmailUrl = url;
        this.gmailCallback = callback;
    }

    public static registerTwitterAuthOn(authConfig: TwitterAuthConfig, url: string, callback: Function) {
        this.twitterConfig = authConfig;
        this.twitterUrl = url;
        this.twitterCallback = callback;
    }

    public static listenOn(port: number) {
        this.server.use(cookieParser());
        if (this.gmailConfig && this.gmailUrl && this.gmailCallback) {
            this.server.get(Authorizer.gmailUrl, function (request, response) {
                response.redirect(Authorizer.generateGmailAuthUri());
            });

            let redirectUrl = Authorizer.gmailConfig.redirectUrl;
            redirectUrl = redirectUrl.substr(redirectUrl.lastIndexOf("/"));

            this.server.get(redirectUrl, function (request, response) {
                let auth = Authorizer.getGmailAuth();
                Authorizer.authorizeGmail(auth, request.query.code).then(function (auth) {
                    Authorizer.gmailCallback(auth, request);
                    // response.send("Done authorization");
                    response.redirect("http://localhost:8000/");
                });
            });
        }
        if (this.twitterConfig && this.twitterUrl && this.twitterCallback) {
            let otoken;
            let otokenSecret;
            let auth;
            this.server.get(Authorizer.twitterUrl, function (request, response) {
                auth = Authorizer.getTwitterAuth();
                auth.getOAuthRequestToken(function (error, oauth_token, oauth_token_secret, results) {
                    if (!error) {
                        otoken = oauth_token;
                        otokenSecret = oauth_token_secret;
                        response.redirect("https://twitter.com/oauth/authenticate?oauth_token=" + oauth_token);
                    }
                });
            });

            let redirectUrl = Authorizer.twitterConfig.redirectUrl;
            redirectUrl = redirectUrl.substr(redirectUrl.lastIndexOf("/"));

            this.server.get(redirectUrl, function (request, response) {
                Authorizer.authorizeTwitter(auth, request.query.oauth_token, otokenSecret, request.query.oauth_verifier).then(function (auth) {
                    Authorizer.twitterCallback(auth, request);
                    // response.send("Done authorization");
                    response.redirect("http://localhost:8000/");
                });
            });
        }
        this.server.listen(port);
    }

    private static getGmailAuth() {
        return new Oauth2(this.gmailConfig.clientId, this.gmailConfig.clientSecret, this.gmailConfig.redirectUrl);
    }

    private static generateGmailAuthUri(): string {
        return this.getGmailAuth().generateAuthUrl({
            access_type: "offline",
            scope: this.gmailConfig.scopes
        });
    }

    private static authorizeGmail(auth, code: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            auth.getToken(code, function (error, tokens) {
                if (!error) {
                    auth.setCredentials(tokens);
                    resolve(auth);
                } else {
                    reject(error);
                }
            });
        });
    }

    private static getTwitterAuth() {
        return new OAuth(
            "https://api.twitter.com/oauth/request_token",
            "https://api.twitter.com/oauth/access_token",
            this.twitterConfig.consumerKey,
            this.twitterConfig.consumerSecret,
            "1.0",
            this.twitterConfig.redirectUrl,
            "HMAC-SHA1"
        );
    }

    private static authorizeTwitter(auth, otoken: string, oaccessTokenSecret: string, overifier: string): Promise<any> {
        return new Promise(function (resolve, reject) {
            auth.getOAuthAccessToken(otoken, oaccessTokenSecret, overifier,
                function (error, oauth_access_token, oauth_access_token_secret, results) {
                    if (!error) {
                        resolve(new TwitterAuth(
                            Authorizer.twitterConfig.consumerKey,
                            Authorizer.twitterConfig.consumerSecret,
                            oauth_access_token,
                            oauth_access_token_secret
                        ));
                    } else {
                        reject(error);
                    }
                });
        });
    }

}

module.exports = Authorizer;
