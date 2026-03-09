// email-builder.js — compose email from blocks, output email.html

import fs from 'fs';

// ─── TOKENS
const C = {
	bg: '#222222',
	box: '#1a1a1d',
	boxFooter: '#0d0d0d',
	accent1: '#d39d59',
	accent2: '#f28b82',
	text: '#b2b2b2',
	border: '#363636',
	borderList: '#37373b',
	white: '#ffffff',
	linkColor: '#4d9fd4',
	listDot: '#eaaf9e',
	listTitle: '#c0c0c0',
};

const pad = { x: 30, blockBtm: 15 };
const fontSize = { base: '15px', small: '14px', h2: '18px', h3: '17px' };
const borderWidth = 2;

// ─── SHARED STYLES
const shared = {
	text: `margin:0;font-size:${fontSize.base};line-height:1.6;color:${C.text}`,
	link: `display:inline;font-size:${fontSize.base};color:${C.linkColor};text-decoration:none`,
	headBase: `margin:0;font-weight:normal;line-height:1.3;letter-spacing:0.5px;text-transform:uppercase`,
	cell: `padding:0 ${pad.x}px ${pad.blockBtm}px`,
	borderList: `border-bottom:1px solid ${C.borderList}`,
	hr: `border:none;border-top:${borderWidth}px solid ${C.border};margin:0`,
	icon: `display:inline-block;overflow:hidden;background-color:${C.bg};border-radius:50%;text-align:center;border:1px solid ${C.borderList};`,
	iconImg: `display:block;vertical-align:middle;border:0;`,
};

// ─── ICONS
const icons = {
	tg: 'https://buhowski.dev/assets/email/telegram.png',
	ig: 'https://buhowski.dev/assets/email/instagram.png',
	li: 'https://buhowski.dev/assets/email/linkedin.png',
	em: 'https://buhowski.dev/assets/email/email.png',
};

// ─── HELPERS
const link = (label, url) =>
	`<a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.link};">${label}</a>`;

// ─── BLOCKS
const header = () => `
  <tr>
    <td style="padding:40px ${pad.x}px 0;"></td>
  </tr>`;

const h2 = (content, top = 20) => `
  <tr>
    <td style="padding:${top}px ${pad.x}px ${pad.blockBtm}px;">
      <p style="${shared.headBase};color:${C.accent1};font-size:${fontSize.h2};">${content}</p>
    </td>
  </tr>`;

const h3 = (content, top = 20) => `
  <tr>
    <td style="padding:${top}px ${pad.x}px ${pad.blockBtm}px;">
      <p style="${shared.headBase};color:${C.accent2};font-size:${fontSize.h3};">${content}</p>
    </td>
  </tr>`;

const text = (content) => `
  <tr>
    <td style="${shared.cell};">
      <p style="${shared.text};">${content}</p>
    </td>
  </tr>`;

const linkList = (items) => `
  <tr>
    <td style="padding:15px ${pad.x}px 30px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${items
					.map(({ title, label, url }, i) => {
						const borderList = i < items.length - 1 ? shared.borderList : '';
						const padList = 14;
						const dotWidth = 4;

						return `
        <tr>
          <td style="padding:${padList}px 0;${borderList};width:${dotWidth}px;">
            <table cellpadding="0" cellspacing="0" border="0"><tr><td width="${dotWidth}" height="${dotWidth}" style="width:${dotWidth}px;height:${dotWidth}px;background-color:${C.listDot};border-radius:50%;line-height:0;">&nbsp;</td></tr></table>
          </td>
          <td style="padding:${padList}px 10px;${borderList};">
            <span style="font-size:${fontSize.base};color:${C.listTitle};">${title}</span>
          </td>
          <td style="padding:${padList}px 0;${borderList};" align="right">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.link};">${label}</a>
          </td>
        </tr>`;
					})
					.join('')}
      </table>
    </td>
  </tr>`;

const divider = () => `
  <tr>
    <td style="padding:20px 0 0;">
      <hr style="${shared.hr};" />
    </td>
  </tr>`;

const footer = (copy, links) => {
	const year = new Date().getFullYear();
	const resolvedCopy = copy.replace(/\d{4}/, year);
	const iconWidth = 52;

	return `
  <tr>
    <td bgcolor="${C.boxFooter}" align="center" style="background-color:${C.boxFooter};padding:35px ${pad.x}px 40px;">
      <p style="margin:0 0 25px;text-align:center;">
        <a href="https://buhowski.dev" target="_blank" rel="noopener noreferrer" style="font-size:${fontSize.small};color:#666666;text-decoration:none;letter-spacing:1px;">${resolvedCopy}</a>
      </p>

      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          ${links
						.map(
							({ url, icon }) => `<td style="padding:0 6px;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.icon};">
              <img src="${icon}" alt="" width="${iconWidth}" height="${iconWidth}" style="${shared.iconImg};" />
            </a>
          </td>`,
						)
						.join('')}
        </tr>
      </table>
    </td>
  </tr>`;
};

// ─── COMPILE
const compile = (blocks, bg = C.bg) => `<!DOCTYPE html>
<html lang="ukr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1.0" />
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background:${bg};font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:100%;background:${bg};font-family:Helvetica,Arial,sans-serif;font-size:${fontSize.base};font-weight:normal;">
    <tr>
      <td align="center" style="padding:45px 6px;">
        <table width="610" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.box}" style="width:100%;max-width:610px;background:${C.box};border-radius:20px;overflow:hidden;box-shadow:0 0 10px #000000;border:${borderWidth}px solid ${C.border};">
          ${blocks.join('\n')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export { compile, header, h2, h3, text, link, linkList, divider, footer, icons };

// ─── COMPOSE
const email = compile([
	header(),

	text('Привіт.'),

	text(
		'Я Олександр — ідейний розробник, сценарист і дослідник. Спроєктував модель незалежної екосистеми у вигляді журналу та соцмережі — шукаю співзасновників і партнерів.',
	),

	h2('Про проєкт'),

	text(
		'Це розважальне й контркультурне медіа, яке поступово еволюціонує у кіновиробництво, геймдев і розробку технологій.',
	),

	text(
		'Журнал і платформа формують аудиторію, а згодом інтегруються стрімінгова відеоплатформа і ігровий хаб для реалізації власних проєктів.',
	),

	text(`Презентація: ${link('buhowski.dev/vision', 'https://buhowski.dev/vision')}`),

	h2('Пропозиція'),

	text(
		"Тут з'являєтеся ви — люди, які мені імпонують, з критичною мозковою активністю, схожою оцінкою реальності та вайбом інтелектуального хуліганства.",
	),

	text(
		'Розглянули б ви можливість долучитися — як співзасновник, партнер, консультант чи кріейтор окремих проєктів? (всі ідеї — нижче)',
	),

	linkList([
		{ title: 'Бізнес-план', label: 'buhowski.dev/vision', url: 'https://buhowski.dev/vision' },
		{ title: 'Стратегія', label: 'buhowski.dev/mvp', url: 'https://buhowski.dev/mvp' },
		{ title: 'Проєкти кіно', label: 'buhowski.dev/cinema', url: 'https://buhowski.dev/cinema' },
		{ title: 'Проєкти геймдев', label: 'buhowski.dev/games', url: 'https://buhowski.dev/games' },
		{
			title: 'Презентаційні шоу',
			label: 'buhowski.dev/self-presentation',
			url: 'https://buhowski.dev/self-presentation',
		},
	]),

	text('Буду радий відповіді — напишіть, обговоримо деталі.'),

	divider(),

	footer(`${new Date().getFullYear()} © Olexander Tsiomakh`, [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em },
	]),
]);

fs.writeFileSync('email.html', email);
