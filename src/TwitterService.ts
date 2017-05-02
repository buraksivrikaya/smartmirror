/**
 * TwitterService
 */

import { User } from "./User";
const Tweet = require("./Tweet.js");
const Twit = require("twit");
const Promise = require("promise");

class TwitterService {

    private readonly twit;

    constructor(user: User) {
        this.twit = new Twit({
            consumer_key: user.twitterAuth.consumerKey,
            consumer_secret: user.twitterAuth.consumerSecret,
            access_token: user.twitterAuth.accessToken,
            access_token_secret: user.twitterAuth.accessTokenSecret
        });
    }

    readTweet(count: number): Promise<any> {
        let that = this;
        return new Promise(function (resolve, reject) {
            that.twit.get("statuses/home_timeline", { count: count }, function (err, data, response) {
                if (!err) {
                    let tweets = [];
                    for (let i = 0; i < data.length; i++) {
                        tweets.push(new Tweet(
                            data[i]["created_at"],
                            data[i]["user"]["name"],
                            data[i]["text"]
                        ));
                    }
                    resolve(tweets);
                } else {
                    reject(err);
                }
            })
        });
    }

}

module.exports = TwitterService;
