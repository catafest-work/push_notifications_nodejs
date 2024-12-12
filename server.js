const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    if (req.url === '/notification_service.js') {
        fs.readFile('notification_service.js', (err, data) => {
            res.writeHead(200, {'Content-Type': 'application/javascript'});
            res.end(data);
        });
    } else {
        fs.readFile('index.html', (err, data) => {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.end(data);
        });
    }
});

server.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
});