# Pigskit Web

## Pages

* root : Entrance page of the Pigskit website.
* home : User dashboard page.
  * shops : Create and search user shops.
  * profile : Maintain user profile.
* shop : Shop dashboard page.
  * outline : Provide shop entrance and information.
  * products : Maintain shop products.
    * create_product : Create a new product.
    * edit_product : Edit a existed product.
  * orders : Display shop orders.
* menu : Shop menu page.
  * menu : Display shop products to guests and they can make some choices.
  * cart : Edit items the guest choice and submit the order.
  * orders : Display orders the guest have made at current shop.

## Run dev-server

For example run dev-server that host home page.
```
> npm run dev-home
```
And you can visit http://localhost:3000 to check the page.  

If there a new page should be add in the future. You should add the corresponding script in package.json.
```
"scripts": {
    ...
    "dev-root": "npm run webpack-dev",
    "dev-home": "MODULE=home npm run webpack-dev",
    "build-shop": "MODULE=shop npm run webpack-prod",
    ...
},
```

## Build all pages and run production server locally
build all pages:
```
> npm run build
```

Run production server locally
```
> npm run restart
```

or just
```
> npm run restart
```
And you can visit http://localhost to check full website locally.

If there a new page should be add in the future. You can add the corresponding module name in build.bash.
```
# Declare all modules that should be builded.
declare -a builds
builds=(
    build-server
    build-root
    build-home
    ...
)
```

## SSL
The locally running production server will start as a http server if ssl certificate not provided.  
To locally run a https production server you have to provide a self-signed certificate.
```
> cd path/to/pigskit-web/certificate
> openssl req -nodes -new -x509 -keyout privkey.pem -out cert.pem
...
> cd ..; npm run restart
...
Development https server listening port: 443.
```
And you can visit https://localhost to check full website locally.