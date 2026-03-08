// email-builder.js — compose email from blocks, output email.html

import fs from 'fs';

// ─── TOKENS
const C = {
	bg: '#232526',
	box: '#202020',
	accent1: '#f6b96f',
	accent2: '#f28b82',
	text: '#dfdfdf',
	icon: '#141414',
};

// ─── STYLES
const pad = { x: 35, blockB: 20, headB: 25 };

const pStyle = `margin:0;font-size:16px;line-height:1.5;color:${C.text}`;

const S = {
	cell: `padding:0 ${pad.x}px ${pad.blockB}px`,

	cellHead: `padding:40px ${pad.x}px 0`,

	headText: `font-weight:normal;line-height:1.3`,

	hr: `border:none;border-top:1px solid #42413c;margin:0`,

	link: `display:inline;white-space:nowrap;border-radius:5px;line-height:1.9;padding:4px 11px;color:#ffffff;text-decoration:none;background-color:#006faf;box-shadow:inset 1px 1px 10px #003554,inset -1px -1px 10px #003554,0 0 2px #000000`,

	icon: (bg) =>
		`display:inline-block;width:52px;height:52px;background-color:${bg};border-radius:50%;text-align:center;line-height:50px`,

	iconImg: `display:inline-block;vertical-align:middle;border:0`,
};

// ─── ICONS
const toBase64 = (path) => {
	const data = fs.readFileSync(path).toString('base64');
	return `data:image/png;base64,${data}`;
};

const icons = {
	tg: toBase64('./assets/tg.png'),
	ig: toBase64('./assets/ig.png'),
	li: toBase64('./assets/in.png'),
	em: toBase64('./assets/mail.png'),
};

// ─── HELPERS
const link = (label, url) =>
	`<a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.link};">${label}</a>`;

// ─── BLOCKS
const h2 = (content) => `
  <tr>
    <td style="${S.cellHead};">
      <p style="margin:0 0 ${pad.headB}px;${S.headText};color:${C.accent1};font-size:27px;">${content}</p>
    </td>
  </tr>`;

const h3 = (content) => `
  <tr>
    <td style="${S.cellHead};">
      <p style="margin:0 0 ${pad.headB}px;${S.headText};color:${C.accent2};font-size:21px;">${content}</p>
    </td>
  </tr>`;

const text = (content) => `
  <tr>
    <td style="${S.cell};">
      <p style="margin:0;${pStyle};">${content}</p>
    </td>
  </tr>`;

const textLink = (content, label, url) => `
  <tr>
    <td style="${S.cell};">
      <p style="${pStyle};">${content}</p>

      <a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.link};">${label}</a>
    </td>
  </tr>`;

const divider = () => `
  <tr>
    <td style="padding:15px ${pad.x}px 5px;">
      <hr style="${S.hr};" />
    </td>
  </tr>`;

const footer = (copy, links) => {
	const year = new Date().getFullYear();
	const resolvedCopy = copy.replace(/\d{4}/, year);

	return `
  <tr>
    <td bgcolor="${C.box}" align="center" style="padding:30px ${pad.x}px 40px; ">
      <p style="margin:0 0 25px;font-size:12px;color:${C.text};">${resolvedCopy}</p>

      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          ${links.map(({ url, icon }) => `<td style="padding:0 7px;"><a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.icon(C.icon)};"><img src="${icon}" alt="" width="21" height="21" style="${S.iconImg};" /></a></td>`).join('')}
        </tr>
      </table>
    </td>
  </tr>`;
};

// ─── COMPILE
const compile = (blocks, bg = C.bg) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.box}" style="width:100%;max-width:600px;background:${C.box};border-radius:20px;overflow:hidden;box-shadow:0 0 10px #000000;">
          ${blocks.join('\n')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── COMPOSE
const email = compile([
	h2('Heading h2'),
	h3('Heading h3'),
	text('Paragraph text.'),
	text(`Бізнес-план ${link('buhowski.dev/vision', 'https://buhowski.dev/vision')}`),
	textLink('Бізнес-план', 'buhowski.dev/vision', 'https://buhowski.dev/vision'),

	divider(),

	footer('2026 © Olexander Tsiomakh', [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em },
	]),
]);

fs.writeFileSync('email.html', email);
console.log('email.html');
