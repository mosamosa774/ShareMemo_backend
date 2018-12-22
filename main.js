const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
var fs = require('fs');
var path = require('path');
const bodyParser = require('body-parser');

var filePath = path.join(__dirname, 'item.txt');

app.use(express.static(__dirname + "/dist/"));

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//app.use(express.favicon(path.join(__dirname, 'public/favicon.ico'))); 

app.get('/', function(req, res) {
    res.sendfile(__dirname + "/dist/index.html");
});
app.get('/file', function(req, res) {
    res.setHeader('content-Type', 'application/json; charset=utf-8' );
    fs.access(filePath, fs.constants.F_OK | fs.constants.W_OK, (err) => {
        if (err) {
            res.send({text: " "});
            throw err;
        } else {
            fs.readFile(filePath, "utf-8", function (err, data) {
                if (err) {
                  next(err); // Pass errors to Express.
                }
                else {
                    console.log(data)
                    res.send({text: data});
                }
            });
        }
    });
});
app.post('/file', function(req, res) {
    console.log(req.body);
    console.log(req.body.text);
    fs.writeFile(filePath, req.body.text, function (err) {
        if (err) {
            next(err);
            throw err;
        }
        console.log('Saved!');
        res.send("done")
    });
});

app.listen(port);

console.log("Server is up!! Port: ", port);