const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const http = require("http");
const firebase = require("firebase/app");
const firebaseCredentials = require("./firebaseCredentials.json");

require("firebase/auth");
require("firebase/firestore");

//setup express server. 
var app = express();
const server = http.createServer(app);
const port = process.env.PORT || 10000;

var publicPath = path.resolve(__dirname, "public");

//setup static paths for front-end use
app.use("/public", express.static("public"));
app.use("/images", express.static("images"));
app.use("/scripts", express.static(path.join("public", "build")));

app.use(bodyParser.urlencoded({
	extended: true
}));

//Initialize instance of firestore
firebase.initializeApp({
    apiKey: firebaseCredentials.apiKey,
    authDomain: firebaseCredentials.authDomain,
    projectId: firebaseCredentials.projectId
});

var db = firebase.firestore();

function retrieveExpenses(callback) {
    db.collection("Expenses").get().then((querySnapshot) => {
        var output = [];
        
        querySnapshot.forEach((doc) => {
            var item = {};
            var data = doc.data();
            item["ID"] = doc.id;
            item["Name"] = data.Name;
            item["Cost"] = data.Cost;
            item["Category"] = data.Category;
            
            output.push(item);
        });
        callback(output);
    });
}

//reads from the database and returns an object
app.post("/dbRead", function(req, resp) {
    retrieveExpenses(function(expenses) {
        resp.send(expenses);
    });
});

//writes to the database and returns the updated database
app.post("/dbWrite", async function(req, resp) {
   db.collection("Expenses").add({
       Name: req.body.Name,
       Cost: req.body.Cost,
       Category: req.body.Category
   }).then(function(docRef) {
       console.log("Expenses added with ID: " + docRef.id);
       retrieveExpenses(function(expenses) {
           resp.send(expenses);
       });
   }).catch(function(error) {
       console.log("ERROR: " + error);
   });
});

//deletes from the database.
app.post("/dbDelete", function(req, resp) {
    db.collection("Expenses").doc(req.body.id).delete().then(function() {
        console.log("Successfully deleted document!");
        retrieveExpenses(function(expenses) {
            resp.send(expenses);
        });
    }).catch(function(error) {
        console.log("ERROR: " + error);
    });
});

//sends the homepage
app.get("/", function(req, resp) {
   resp.sendFile(publicPath + "/index.html"); 
});

//starts the server
server.listen(port, function(err) {
    if(err) {
        console.log(err);
        return(false);
    }
    console.log(port + " is running!");
});