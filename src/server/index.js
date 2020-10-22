import fs from 'fs'
import express from 'express'
import http from 'http'
import https from 'https'
import httpProxy from 'http-proxy'
import * as path from 'path'
import html_template from './index.hbs'

// The port then server will listen to.
const PORT = process.env.PORT
// During development the env_variable `LOCAL` should be set as true that indicate that servers must be proxied locally.
const PIGSKIT_RESTFUL_HOST = process.env.LOCAL ? 'localhost' : 'pigskit-restful-server'
const PIGSKIT_GRAPHQL_HOST = process.env.LOCAL ? 'localhost' : 'pigskit-graphql-server'

const app = express()
const proxy = httpProxy.createProxyServer({})

// Limit content length.
app.use((req, res, next) => {
    let contentLength = req.headers['content-length'] || 0
    if (contentLength > 200000) {
        res.status(400).send({
            type: 'PayloadTooLarge',
        })
    } else {
        next()
    }
})

// Proxy RESTful server.
app.use('/api', (req, res, next) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_RESTFUL_HOST}:8001/api` }, next)
})

// Proxy GraphQL query on GraphQL server.
app.post('/graphql', (req, res, next) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_GRAPHQL_HOST}:8000/graphql` }, next)
})

// Proxy GraphiQL page on GraphQL server.
app.get('/graphiql', (req, res, next) => {
    proxy.web(req, res, { target: `http://${PIGSKIT_GRAPHQL_HOST}:8000/graphiql` }, next)
})

// Host web pages.
app.get(/^\/$|^\/home\/$|^\/shop\/$|^\/menu\/$/, (req, res) => {
    res.send(html_template({ title: 'Pigskit' }))
})

// Host web assets.
app.use(express.static(__dirname + '/public/'))

// Server listen to `PORT` if it is specified.
if (PORT) {
    http.createServer(app).listen(PORT, () => console.log(`Http server listening port: ${PORT}.`))
} else {
    console.log('Trying to start as https server...')
    try {
        const privateKey = fs.readFileSync(path.join(__dirname, '../certificate/privkey.pem'), 'utf8')
        const certificate = fs.readFileSync(path.join(__dirname, '../certificate/cert.pem'), 'utf8')
        console.log('Found server key and certificate.')

        console.log('Trying to start with letsencrypt certificate...')
        try {
            const ca = fs.readFileSync(path.join(__dirname, '../certificate/chain.pem'), 'utf8')
            console.log('Found ca info.')

            const credentials = {
                key: privateKey,
                cert: certificate,
                ca: ca,
            }
            https.createServer(credentials, app).listen(443, () => console.log(`Production https server listening port: 443.`))
        } catch(error) {
            console.log(error)
            console.log('No ca info found.')

            const credentials = {
                key: privateKey,
                cert: certificate,
            }
            https.createServer(credentials, app).listen(443, () => console.log(`Development https server listening port: 443.`))
        }
    } catch(error) {
        console.log(error)
        console.log('No server key or certificate found.')

        http.createServer(app).listen(80, () => console.log(`Http server listening port: 80.`))
    }
}