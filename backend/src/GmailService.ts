/**
 * GmailService
 */

import { Gmail } from "./Gmail";
import { User } from "./User";
const Promise = require("promise");
const googleapis = require("googleapis");
const Base64 = require('js-base64').Base64;

export class GmailService {

    readonly auth;
    readonly gmailApi;

    constructor(user: User) {
        this.auth = user.gmailAuth;
        this.gmailApi = googleapis.gmail({
            auth: this.auth,
            version: "v1"
        });
    }

    readMail(count: number): Promise<Gmail[]> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.readMailId(count).then(function (result) {
                let mails = [];
                for (let i = 0; i < result.length; i++) {
                    that.readMailById(result[i]).then(function (mailResult) {
                        mails.push(mailResult);
                        if(mails.length === result.length) {
                            resolve(mails);
                        }
                    }).catch(function (error) {
                        reject(error);
                    });
                }
            }).catch(function (error) {
                reject(error);
            });
        });
    }

    private readMailId(count: number): Promise<string[]> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.list({
                userId: "me",
                maxResults: count
            }, function (error, result) {
                if (!error) {
                    let ids = [];
                    for (let i = 0; i < result.messages.length; i++) {
                        ids.push(result.messages[i]["id"]);
                    }
                    resolve(ids);
                } else {
                    reject(error);
                }
            });
        });
    }


    readMailById(id: string): Promise<Gmail> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.gmailApi.users.messages.get({
                userId: "me",
                "id": id
            }, function (error, result) {
                if (!error) {
                    resolve(new Gmail(
                        id,
                        result.payload.headers[15].value,
                        result.payload.headers[10].value,
                        result.payload.headers[12].value,
                        result["snippet"],
                        Base64.decode(result.payload.parts[1]["body"]["data"])
                    ));
                } else {
                    reject(error);
                }
            });
        });
    }

}
