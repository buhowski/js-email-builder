import http from 'http';
import fs, { existsSync } from 'fs';
import { execSync } from 'child_process';
import chokidar from 'chokidar';

const PORT = 3030;

// source file for build
const SOURCE = existsSync('email-to.js') ? 'email-to.js' : 'email-builder.js';

// inject live reload script
const inject = (html) =>
	html.replace(
		'</body>',
		`<script>
const es = new EventSource("/sse");
es.onmessage = () => location.reload();
</script></body>`,
	);

let clients = [];

// rebuild source and notify clients
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

// server
http
	.createServer((req, res) => {
		if (req.url === '/sse') {
			res.writeHead(200, {
				'Content-Type': 'text/event-stream',
				'Cache-Control': 'no-cache',
				Connection: 'keep-alive',
			});
			clients.push(res);
			req.on('close', () => {
				clients = clients.filter((r) => r !== res);
			});
			return;
		}

		// determine file to serve
		let file =
			SOURCE === 'email-builder.js'
				? req.url === '/'
					? 'index.html'
					: req.url.slice(1)
				: req.url === '/'
					? 'email-to.html'
					: req.url.slice(1);

		if (!file.endsWith('.html')) file += '.html';

		if (!existsSync(file)) {
			res.writeHead(404);
			return res.end('not found');
		}

		const html = fs.readFileSync(file, 'utf8');
		res.writeHead(200, { 'Content-Type': 'text/html' });
		res.end(inject(html));
	})
	.listen(PORT, () => console.log(`http://localhost:${PORT} — ${SOURCE}`));

// watch only the source file for changes
chokidar.watch(SOURCE).on('change', rebuild);

// initial build
rebuild();
