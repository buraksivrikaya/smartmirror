const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");
// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: "200px", height: "200px" });
    //win.setFullScreen(true);
    // and load the index.html of the app.
    win.loadURL(url.format({
        pathname: path.join(__dirname, "html/gui.html"),
        protocol: "file:",
        slashes: true
    }));

    // Open the DevTools.
    win.webContents.openDevTools();
    // Emitted when the window is closed.
    win.on("closed", () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null

    });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit()
    }
});

app.on("activate", () => {
    // On macOS it"s common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow()
    }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.

/******************************************************************
*                                                                 *
*                     LOCALHOST OPERATIONS                        *
*                                                                 *
*****************************************************************/

const Authorizer = require("./libs/Authorizer.js");
const fs = require("fs");
const User = require("./libs/User.js");
const GmailAuthConfig = require("./libs/GmailAuthConfig.js");
const TwitterAuthConfig = require("./libs/TwitterAuthConfig.js");
const Twit = require("twit");
const TwitterService = require("./libs/TwitterService.js");
const cookie_name = "smloggeduser";

let gconfig = JSON.parse(fs.readFileSync("data/gconfig.json"));

let gauthConfig = new GmailAuthConfig(
    gconfig["clientId"],
    gconfig["clientSecret"],
    gconfig["redirectUrl"],
    gconfig["scopes"]
);

Authorizer.registerGmailAuthOn(gauthConfig, "/auth/gmail", function (auth, req) {
    // Now we have authorization
    // let user = new User(2, "test");
    // user.setGmailAuth(auth);
    // Save it for later usage...
    // user.saveTo("data/test2GMAIL.json");
    console.log(req.cookies[cookie_name]);
});

//let tconfig = JSON.parse(fs.readFileSync("data/tconfig.json"));

/*
let tauthConfig = new TwitterAuthConfig(
    tconfig["consumerKey"],
    tconfig["consumerSecret"],
    tconfig["redirectUrl"]
);

Authorizer.registerTwitterAuthOn(tauthConfig, "/auth/twitter", function (auth, req) {
    // Now we have authorization
    let user = new User(2, "test");
    user.setTwitterAuth(auth);
    // Save it for later usage...
    user.saveTo("data/test2TWITTER.json");
});
*/

Authorizer.listenOn(3000);

// let user = User.loadFrom("data/test2TWITTER.json");
// let ts = new TwitterService(user);

// ts.readTweet(2).then(function (tweets) {
//     console.log(tweets[0]);
//     console.log(tweets[1]);
// });


var express = require('express');
var cookieParser = require('cookie-parser');
var webApp = express();

webApp.use(express.static('www'));
webApp.use(cookieParser());
webApp.listen(8000, function () {
    console.log('smart mirror is listening from port 8000...');
});


webApp.get('/login', function (req, res) {
    var data = req.query;

    if (fs.existsSync('data/' + data.id + '.json')) {//id, password, [id,isadmin]
        var userSettings = JSON.parse(fs.readFileSync('./data/' + data.id + '.json'));
        if (userSettings.password == data.password) {
            // set user cookie for later usage
            res.cookie(cookie_name, data.id);
            var response = [data.id, userSettings.isAdmin];
            res.send(JSON.stringify(response));
        }
        else {
            res.send("2");//wrong password
        }
    }
    else {
        res.send("1");//no username

    }
    res.end();
});

webApp.get('/getUserSettings', function (req, res) {//id, [gmail, twitter]
    var data = req.query;
    var userData = JSON.parse(fs.readFileSync('./data/' + data.id + '.json'));
    var user = {};
    user.gmail = userData.gmailAuth != null ? 1 : 0;
    user.twitter = userData.twitterAuth != null ? 1 : 0;
    user.id = data.userid;
    res.send(JSON.stringify(user));

    res.end();
});

webApp.get('/getUsers', function (req, res) {//[{userid, gmail, twitter}]
    var userList = JSON.parse(fs.readFileSync('./data/user-meta.json'));
    var pureUserList = [];

    userList.forEach(function (item, index) {
        var userData = JSON.parse(fs.readFileSync('./data/' + item));
        var user = {};
        user.gmail = userData.gmailAuth != null ? 1 : 0;
        user.twitter = userData.twitterAuth != null ? 1 : 0;
        user.id = item.split('.')[0];
        pureUserList.push(user);
    });

    res.send(JSON.stringify(pureUserList));
    res.end();
});

webApp.get('/removeUser', function (req, res) {//SHOULD ALSO DELETE IMGS FOLDER //id,
    console.log("kullanici sil " + req.query.id);
    fs.unlinkSync('./data/' + req.query.id + '.json');
    var userList = JSON.parse(fs.readFileSync('./data/user-meta.json'));
    userList.splice(userList.indexOf(req.query.id + '.json'), 1);
    fs.writeFileSync('./data/user-meta.json', JSON.stringify(userList));
    res.end();
});

var cmd = require('node-cmd');
var wirelessDev = 'wlp5s0';



webApp.get('/getWirelessList', function (req, res) {//SHOULD ALSO DELETE IMGS FOLDER //id,
    var wirelessList = [];
    cmd.get(
        //'iwlist '+ wirelessDev +' scan | egrep "Cell |Quality|ESSID"',
        'nmcli -f BARS,SSID dev wifi list',
        function (err, data, stderr) {
            var parsedList = [];
            if (!err) {
                if (data) {
                    unparsedList = data.split('\n');

                    for (var i = 1; i < unparsedList.length - 1; i++) {
                        var power = unparsedList[i].substring(0, 4);
                        var ssid = unparsedList[i].substring(5, unparsedList[1].length).replace(/\s+/g, "");
                        wirelessList.push({ "power": power, "ssid": ssid });
                    }
                    res.send(JSON.stringify(wirelessList));
                    res.end();

                }
            }
            else {
                    console.log('error', err);
            }
        }); 
});

webApp.get('/connectNetwork', function (req, res) {//SHOULD ALSO DELETE IMGS FOLDER //id,
    var ssid = req.query.ssid;
    var pass = req.query.password;

    //cmd.run('sudo nmcli device wifi connect '+ ssid +' password '+ pass);
    
    cmd.get(
        //'sudo iwconfig wlp5s0 essid ' + ssid + ' key s:' + pass, //tamam kolay gelsin. buraya göre baglancak iste bu. denerim ben
        'nmcli device wifi connect '+ ssid +' password '+ pass,
        function (err, data, stderr) {
            if (!err) {
                if (data) {
                    console.log(data);
                    res.send(data);
                    res.end();
                }
            } else {
                    console.log('error', err);
                }

            
        }); 

});