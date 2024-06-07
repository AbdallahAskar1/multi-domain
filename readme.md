# Multi-domain

This is a simple example of how to use vhost to serve multiple domains from the same server.

## How to run

1. Install Node.js
2. Install dependencies by running `npm install`
3.  Run as an Administrator by running `npm start`

## How it works

The `server.js` file uses the `vhost` module to create a new express app for each domain. The app is then mounted on the server using the `use` method. The `domains.json` file contains a list of domains that the server should serve. Each domain is mapped to a different app using the `vhost` module. The server listens on port 3000 and prints a message to the console when it is running.

## How to configure 
### windows hosts file
-  update the C:\Windows\System32\drivers\etc\hosts file with the following content
```
127.0.0.1       domain1.com
127.0.0.1       domain2.com
```
### unix based hosts file
-  update the /etc/hosts file with the following content
```
127.0.0.1       domain1.com
127.0.0.1       domain2.com
```

### linux hosts file
-  update the /etc/hosts file with the following content
```
127.0.0.1       localhost
127.0.0.1       domain1.com
127.0.0.1       domain2.com
```

## How to test

1. Open a web browser and navigate to `http://localhost:{PORT}/`
2. You should see the message "Server is running on port {PORT}"
3. Open a web browser and navigate to `http://domain1.com/`
4. You should see the message "hello from domain 1"
5. Open a web browser and navigate to `http://domain2.com/`
6. You should see the message "hello from domain 2"


