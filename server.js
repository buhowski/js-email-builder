// node server.js — watch email-builder.js or _local.js, serve email.html with live reload

import http from 'http';
import fs, { existsSync } from 'fs';
import { execSync } from 'child_process';
import chokidar from 'chokidar';

const PORT = 3030;
const SOURCE = existsSync('_local.js') ? '_local.js' : 'email-builder.js';

const inject = (html) =>
	html.replace(
		'</body>',
		`<script>
  const es = new EventSource("/sse");
  es.onmessage = () => location.reload();
</script></body>`,
	);

let clients = [];

const rebuild = () => {
	try {
		execSync(`node ${SOURCE}`);
		clients.forEach((r) => r.write('data: reload\n\n'));
		clients = [];
		console.log('rebuilt');
	} catch (e) {
		console.error(e.message);
	}
};

http
	.createServer((req, res) => {
		if (req.url === '/sse') {
			res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' });
			clients.push(res);
			req.on('close', () => {
				clients = clients.filter((r) => r !== res);
			});
			return;
		}
		const html = fs.readFileSync('email.html', 'utf8');
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(inject(html));
	})
	.listen(PORT, () => console.log(`http://localhost:${PORT} — ${SOURCE}`));

chokidar.watch(SOURCE).on('change', rebuild);
rebuild();
