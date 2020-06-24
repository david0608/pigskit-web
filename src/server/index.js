import fs from 'fs';
import express from 'express';
import http from 'http';
import https from 'https';
import httpProxy from 'http-proxy';
import * as path from 'path';

const PORT = process.env.PORT;
const PIGSKIT_RESTFUL_HOST = process.env.LOCAL ? 'localhost' : 'pigskit-restful-server';
const PIGSKIT_GRAPHQL_HOST = process.env.LOCAL ? 'localhost' : 'pigskit-graphql-server';

const app = express();
const proxy = httpProxy.createProxyServer({});

proxy.on('error', function (err, req, res) {
    console.log(err)
    res.status(500).end()
});

app.use('/', express.static(__dirname + '/public/'));

app.use('/api', (req, res) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_RESTFUL_HOST}:8001/api` })
});

app.use('/fs', (req, res) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_RESTFUL_HOST}:8001/fs` })
});

app.post('/graphql', (req, res) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_GRAPHQL_HOST}:8000/graphql` });
});

app.get('/graphiql', (req, res) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_GRAPHQL_HOST}:8000/graphiql` });
});

console.log('Trying to start as https server...');
try {
    const privateKey = fs.readFileSync(path.join(__dirname, '../certificate/privkey.pem'), 'utf8');
    const certificate = fs.readFileSync(path.join(__dirname, '../certificate/cert.pem'), 'utf8');
    console.log('Found server key and certificate.');
    console.log('Trying to start with letsencrypt certificate...');

    try {
        const ca = fs.readFileSync(path.join(__dirname, '../certificate/chain.pem'), 'utf8');
        console.log('Found ca info.');
        const credentials = {
            key: privateKey,
            cert: certificate,
            ca: ca,
        };
        https.createServer(credentials, app).listen(PORT || 443, () => console.log(`Production https server listening port: ${PORT || 443}.`));
    } catch(error) {
        console.log(error);
        console.log('No ca info found.');
        const credentials = {
            key: privateKey,
            cert: certificate,
        };
        https.createServer(credentials, app).listen(PORT || 443, () => console.log(`Development https server listening port: ${PORT || 443}.`));
    }
} catch(error) {
    console.log(error);
    console.log('No server key or certificate found.');
    http.createServer(app).listen(PORT || 80, () => console.log(`Http server listening port: ${PORT || 80}.`));
}