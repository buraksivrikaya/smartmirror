/**
 * User
 */

import { TwitterAuth } from "./TwitterAuth";
const fs = require("fs");
const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;

export class User {

    readonly id: number;
    readonly name: string;
    gmailAuth;
    twitterAuth: TwitterAuth;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    setGmailAuth(auth) {
        this.gmailAuth = auth;
    }

    setTwitterAuth(auth: TwitterAuth) {
        this.twitterAuth = auth;
    }

    saveTo(uri: string): void {
        fs.writeFileSync(uri, JSON.stringify(this));
    }

    static loadFrom(uri: string): User {
        let json = JSON.parse(fs.readFileSync(uri));

        let user = new User(json["id"], json["name"]);
        if ("gmailAuth" in json) {
            let auth = new Oauth2(
                json["gmailAuth"]["clientId_"],
                json["gmailAuth"]["clientSecret_"],
                json["gmailAuth"]["redirectUri_"]
            );
            auth.setCredentials(json["gmailAuth"]["credentials"]);
            user.setGmailAuth(auth);
        }
        return user;
    }

}

module.exports = User;
