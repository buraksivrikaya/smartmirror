/**
 * User
 */

const fs = require("fs");
const googleapis = require("googleapis");
const Oauth2 = googleapis.auth.OAuth2;

export class User {

    readonly id: number;
    readonly name: string;
    gmailAuth;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }

    setGmailAuth(auth) {
        this.gmailAuth = auth;
    }

    saveTo(uri: string): void {
        fs.writeFileSync(uri, JSON.stringify(this));
    }

    static loadFrom(uri: string): User {
        let file = fs.readFileSync(uri);
        let json = JSON.parse(file);

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
