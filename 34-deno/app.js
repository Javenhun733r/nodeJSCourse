const http = require('http');
const server = http.createServer((req, res) => {
	res.end('Hello world (from Node!)');
});
server.listen(3000);
