// Dependencies
const fs = require('fs');
const http = require('http');
const https = require('https');
const express = require('express');

const app = express();

// Certificate
const privateKey = fs.readFileSync('/etc/httpd/ssl/mealdaay.key', 'utf8');
const certificate = fs.readFileSync('/etc/httpd/ssl/mealdaay.crt', 'utf8');
const ca = fs.readFileSync('/etc/httpd/ssl/mealdaay-int.crt', 'utf8');

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca
};

app.use((req, res) => {
	res.send('Hello there !');
});

// Starting both http & https servers
const httpServer = http.createServer(app);
const httpsServer = https.createServer(credentials, app);

httpServer.listen(80, () => {
	console.log('HTTP Server running on port 80');
});

httpsServer.listen(5000, () => {
	console.log('HTTPS Server running on port 443');
});