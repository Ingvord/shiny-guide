const http = require('http');
const url = require('url');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');

    // Handle /hello endpoint
    if (trimmedPath === 'hello') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end('<h1>Hello!</h1>');
    }
    // Handle /load endpoint
    else if (trimmedPath === 'load') {
        const query = parsedUrl.query;
        const cpuTime = parseInt(query.cpuTime, 10); // CPU time in milliseconds
        const sleepTime = parseInt(query.sleepTime, 10); // Sleep time in milliseconds
        const startTime = process.hrtime.bigint();

        // Simulate CPU load
        while ((process.hrtime.bigint() - startTime) / BigInt(1000000) < BigInt(cpuTime)) {
            // Intensive computation
        }

        const endUsage = process.cpuUsage();

        // Sleep
        setTimeout(() => {
            const cpuUsage = endUsage.user + endUsage.system;
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(`CPU time: ${cpuUsage} microseconds, Sleep time: ${sleepTime} milliseconds`));
        }, sleepTime);
    }
    // Not found
    else {
        res.writeHead(404);
        res.end();
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
