import express from 'express';
import httpProxy from 'http-proxy';
import * as path from 'path';

const PORT = process.env.PORT || 80;
const app = express();
const proxy = httpProxy.createProxyServer({});

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

app.listen(PORT, () => {
    console.log(`server listening port : ${PORT}`);
});