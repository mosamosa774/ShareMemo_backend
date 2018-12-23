const express = require('express');
const port = process.env.PORT || 8080;
const app = express();
var fs = require('fs');
var path = require('path');
const fetch = require('isomorphic-fetch');
var Dropbox = require('dropbox').Dropbox;
const bodyParser = require('body-parser');
const db = require('dropbox-stream');
console.log(process.env.dropboxAT)
var dbx = new Dropbox({ accessToken: process.env.dropboxAT });

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
    dbx.filesDownload({path: '/item.txt'})
        .then(function(response) {
            var buf = response.fileBinary;
            str = buf.toString('utf-8');
            console.log( str );
            res.send({text: str});
        })
        .catch(function(error) {
            res.send({text: " "});
            console.error(error);
        });
});
app.post('/file', function(req, res) {
    var filePath = path.join(__dirname, '/item.txt');
    fs.writeFileSync(filePath,req.body.text);
    const up = db.createDropboxUploadStream({
        token: process.env.dropboxAT,
        path: '/item.txt',
        chunkSize: 1000 * 1024,
        autorename: true,
        mode: 'overwrite'
    })
    .on('error', err => res.send(err))
    .on('progress', res => console.log(res))
    .on('metadata', metadata => console.log('Metadata', metadata))
     
    fs.createReadStream(filePath).pipe(up)
      .on('finish', () => res.send("done finish!!"))
});

app.listen(port);

console.log("Server is up!! Port: ", port);