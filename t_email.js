// _email.js — personal email composition, not tracked by git
// node _email.js || node server.js

import fs from 'fs';
import { compile, h2, h3, text, link, textLink, divider, footer, icons } from './email-builder.js';

const email = compile([
	h2('_email'),
	h3('Heading h3'),
	text('Paragraph text.'),
	text(`Бізнес-план ${link('buhowski.dev/vision', 'https://buhowski.dev/vision')}`),
	textLink('Бізнес-план', 'buhowski.dev/vision', 'https://buhowski.dev/vision'),

	divider(),

	footer(`${new Date().getFullYear()} © Olexander Tsiomakh`, [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em },
	]),
]);

fs.writeFileSync('email.html', email);
