// const http = require('http');
// const fs = require('fs');
// const path = require('path');

// const server = http.createServer((req, res) => {
//     if (req.url === '/notification_service.js') {
//         fs.readFile('notification_service.js', (err, data) => {
//             res.writeHead(200, {'Content-Type': 'application/javascript'});
//             res.end(data);
//         });
//     } else {
//         fs.readFile('index.html', (err, data) => {
//             res.writeHead(200, {'Content-Type': 'text/html'});
//             res.end(data);
//         });
//     }
// });

// server.listen(3001, () => {
//     console.log('Server running at http://localhost:3001');
// });

// schimbare layer applicatie web
const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer((req, res) => {
    const originalUserAgent = req.headers['user-agent'];
    let browserInfo = originalUserAgent;
    
    if (originalUserAgent && originalUserAgent.includes('Chrome')) {
        browserInfo = originalUserAgent.replace(/Chrome\/[\d\.]+/, 'Firefox/115.0');
        req.headers['user-agent'] = browserInfo;
    }

    if (req.url === '/notification_service.js') {
        fs.readFile('notification_service.js', (err, data) => {
            res.writeHead(200, {
                'Content-Type': 'application/javascript',
                'X-Firefox-Spoof': 'true',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive'
            });
            res.end(data);
        });
    } else {
        fs.readFile('index.html', (err, data) => {
            // Injectăm informațiile despre browser în HTML
            let htmlContent = data.toString();
            htmlContent = htmlContent.replace('</body>', `
                <div id="browser-info">
                    <h3>Browser Information:</h3>
                    <p>Original User Agent: ${originalUserAgent}</p>
                    <p>Modified User Agent: ${browserInfo}</p>
                </div>
                </body>
            `);

            res.writeHead(200, {
                'Content-Type': 'text/html',
                'X-Firefox-Spoof': 'true',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.5',
                'Connection': 'keep-alive'
            });
            res.end(htmlContent);
        });
    }
});

server.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
    console.log('Chrome requests will be masked as Firefox');
});

