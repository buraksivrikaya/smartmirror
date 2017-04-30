const {app, BrowserWindow} = require("electron");
const path = require("path");
const url = require("url");

// Keep a global reference of the window object, if you don"t, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win;

function createWindow () {
  // Create the browser window.
  win = new BrowserWindow();
  win.setFullScreen(true);
  // and load the index.html of the app.
  win.loadURL(url.format({
    pathname: path.join(__dirname, "frontend/html/gui.html"),
    protocol: "file:",
    slashes: true
  }));

  // Open the DevTools.
  //win.webContents.openDevTools();

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
/*
const express = require("express");
const GmailAuth = require("./libs/GmailAuth.js");
const GmailService = require("./libs/GmailService.js");

var auth = new GmailAuth(
  "76077925517-8fhrcebbtmthkssssmb7u5l4jgmr78pg.apps.googleusercontent.com",
  "JYsqVAFo8-9HNFASG7pMt6lQ",
  "http://localhost:3000/oauthcallback",
  "https://www.googleapis.com/auth/gmail.readonly"
  );

var host = express();

host.get("/authorize", function(req, res) {
  res.redirect(auth.generateAuthUrl());
  //console.log(auth.generateAuthUrl());
});

host.get("/oauthcallback", function(req, res) {
  auth.authorize(req.query.code);
});

host.get("/listLastXMails", function(req, res) {
  service = new GmailService(auth.getAuth());
  service.listLastXMailId(1, function(msgs) {
    console.log(msgs)
    console.log(msgs.length);
    for(let i=0; i < msgs.length; i++) {
      let msg = msgs[i];
      service.getEmailById(msg.id, function(mail) {
        console.log(mail);
      });
    }
  });
});

host.listen(3000);*/
