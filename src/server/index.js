import fs from 'fs';
import express from 'express';
import https from 'https';
import httpProxy from 'http-proxy';
import * as path from 'path';

const PORT = process.env.PORT || 443;
const app = express();
const proxy = httpProxy.createProxyServer({});

const privateKey = fs.readFileSync(path.join(__dirname, '../certificate/privkey.pem'), 'utf8');
const certificate = fs.readFileSync(path.join(__dirname, '../certificate/cert.pem'), 'utf8');
const ca = fs.readFileSync(path.join(__dirname, '../certificate/chain.pem'), 'utf8');

const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
};

proxy.on('error', function (err, req, res) {
    console.log(err)
    res.status(500).end()
});

app.use('/', express.static(__dirname + '/public/'));

// app.use('/reply', (req, res) => {
//     proxy.web(req, res, { target: 'http://localhost:3000/reply' });
// });

// app.use('/delay', (req, res) => {
//     proxy.web(req, res, { target: 'http://localhost:3000/delay' });
// });

app.get('/shop', (req, res) => {
    res.send("shop")
})

app.use('/access', (req, res) => {
    proxy.web(req, res, { target: "http://pigskit-restful-server:8001/access" })
})

app.post('/graphql', (req, res) => {
    proxy.web(req, res, { target: 'http://pigskit-graphql-server:8000/graphql' });
});

app.get('/graphiql', (req, res) => {
    proxy.web(req, res, { target: 'http://pigskit-graphql-server:8000/graphiql' });
});

app.get('/home', (req, res) => {
    proxy.web(req, res, { target: 'http://0.0.0.0:3000/' });
});

https.createServer(credentials, app).listen(PORT, () => {
    console.log(`Server listening port : ${PORT}`);
})