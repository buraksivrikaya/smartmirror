/**
 * User
 */

const TwitterAuth = require("./TwitterAuth.js");
const fs = require("fs");
const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;

export class User {

    readonly id: string;
    readonly isAdmin: boolean;
    readonly password: string;
    gmailAuth;
    twitterAuth;

    constructor(id: string, isAdmin: boolean, password: string) {
        this.id = id;
        this.isAdmin = isAdmin;
        this.password = password;
    }

    setGmailAuth(auth) {
        this.gmailAuth = auth;
    }

    setTwitterAuth(auth) {
        this.twitterAuth = auth;
    }

    saveTo(uri: string): void {
        fs.writeFileSync(uri, JSON.stringify(this));
    }

    static loadFrom(uri: string): User {
        let json = JSON.parse(fs.readFileSync(uri));

        let user = new User(json["id"], json["isAdmin"], json["password"]);
        if ("gmailAuth" in json) {
            let auth = new Oauth2(
                json["gmailAuth"]["clientId_"],
                json["gmailAuth"]["clientSecret_"],
                json["gmailAuth"]["redirectUri_"]
            );
            auth.setCredentials(json["gmailAuth"]["credentials"]);
            user.setGmailAuth(auth);
        }
        if ("twitterAuth" in json) {
            let auth = new TwitterAuth(
                json["twitterAuth"]["consumerKey"],
                json["twitterAuth"]["consumerSecret"],
                json["twitterAuth"]["accessToken"],
                json["twitterAuth"]["accessTokenSecret"]
            );
            user.setTwitterAuth(auth);
        }
        return user;
    }

}

module.exports = User;
