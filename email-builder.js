// email-builder.js — compose email from blocks, output email.html

import fs from 'fs';

// ─── ICONS
const icons = {
	tg: 'https://buhowski.dev/assets/email/tg.png',
	ig: 'https://buhowski.dev/assets/email/insta.png',
	li: 'https://buhowski.dev/assets/email/in.png',
	em: 'https://buhowski.dev/assets/email/maill.png',
};

// ─── TOKENS
const C = {
	bg: '#212121',
	box: '#1a1a1a',
	boxFooter: '#111111',
	border: '#383838',
	accent1: '#e4a65b',
	accent2: '#e68383',
	text: '#b2b2b2',
	linkColor: '#5199e1',
	listItemBg: '#1e2028',
};

const pad = { x: 28, blockBtm: 15 };
const fontSize = { base: '15px', small: '12px', h2: '18px', h3: '16px' };
const borderWidth = 2;

// ─── SHARED STYLES
const shared = {
	cell: `padding:0 ${pad.x}px ${pad.blockBtm}px`,
	headBase: `margin:0;font-weight:normal;line-height:1.3;letter-spacing:0.35px;text-transform:uppercase`,
	text: `margin:0;font-size:${fontSize.base};line-height:1.6;color:${C.text}`,
	link: `display:inline;font-size:${fontSize.base};color:${C.linkColor};text-decoration:none;`,
	icon: `display:inline-block;overflow:hidden;border-radius:50%;text-align:center;border:2px solid ${C.border};background-color:${C.box};`,
	hr: `border:none;border-top:${borderWidth}px solid ${C.border};margin:0`,
};

// ─── HELPERS
const link = (label, url) =>
	`<a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.link};white-space:nowrap;padding:6px 1px;letter-spacing:0.5px;">${label}</a>`;

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

const listItem = `vertical-align:middle;font-size:${fontSize.base};line-height: 1;color:${C.linkColor};`;
const listPadX = 25;
const listPadY = 8;
const listPad = `padding:${listPadY}px 0 8px ${listPadX}px;`;
const listPadRight = `padding:${listPadY}px ${listPadX}px 8px 10px;`;

const linkList = (items) => `
  <tr>
    <td style="padding:0 ${pad.x + 2}px 35px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${items
					.map(({ title, url }, i) => {
						const gap =
							i < items.length - 1
								? `<tr><td style="height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>`
								: '';
						return `
        <tr>
          <td style="border-left:2px solid ${C.accent1};">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block;background-color:${C.listItemBg};text-decoration:none;letter-spacing:0.4px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="${listItem}${listPad}">${title}</td>
                  <td align="right" style="${listItem}white-space:nowrap;${listPadRight}font-size:20px;">→</td>
                </tr>
              </table>
            </a>
          </td>
        </tr>${gap}`;
					})
					.join('')}
      </table>
    </td>
  </tr>`;

const divider = () => `
  <tr>
    <td style="padding:25px 0 0;">
      <hr style="${shared.hr};" />
    </td>
  </tr>`;

const footer = (copy, links) => {
	const year = new Date().getFullYear();
	const resolvedCopy = copy.replace(/\d{4}/, year);
	const iconWidth = 50;

	return `
  <tr>
    <td bgcolor="${C.boxFooter}" align="center" style="background-color:${C.boxFooter};padding:35px ${pad.x}px;">
      <p style="margin:0 0 26px;text-align:center;">
        <a href="https://buhowski.dev" target="_blank" rel="noopener noreferrer" style="font-size:${fontSize.small};color:#666666;text-decoration:none;letter-spacing:1px;padding:8px 10px;">${resolvedCopy}</a>
      </p>

      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          ${links
						.map(
							({ url, icon }) => `<td style="padding:0 5px;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.icon};">
              <img src="${icon}" alt="social icon" width="${iconWidth}" height="${iconWidth}" style="display:block;" />
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
  <meta name="color-scheme" content="dark">
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background-color:${bg};font-family:Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:100%;background-color:${bg};font-family:Helvetica,Arial,sans-serif;font-size:${fontSize.base};font-weight:normal;">
    <tr>
      <td align="center" style="padding:45px 6px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.box}" style="width:100%;max-width:600px;background-color:${C.box};border-radius:20px;border:${borderWidth}px solid ${C.border};box-shadow:0 0 10px #000000;overflow:hidden;">
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
		'Я Олександр — ідейний розробник, сценарист і дослідник. Спроєктував незалежний медіапростір у форматі журналу та соціальної платформи.',
	),
	text('Шукаю співзасновників, партнерів, консультантів і кріейторів різних напрямів.'),

	h2('Про проєкт'),

	text(
		'Це розважальне контркультурне медіа, яке поступово еволюціонує у кіновиробництво, геймдев і технологічні розробки.',
	),

	text(
		'Журнал і соцмережа формують аудиторію та задають авторський контекст, після чого інтегруються стрімінгова платформа та ігровий хаб для запуску власних проєктів.',
	),

	text('Я на етапі формування команди — є стратегія, сценарії та концепти.'),

	text(`Презентація: ${link('buhowski.dev/vision', 'https://buhowski.dev/vision')}`),

	h2('Пропозиція'),

	text(
		"Тут з'являєтесь ви — люди, які мені імпонують, з критичним мисленням, схожою оцінкою реальності та вайбом інтелектуального хуліганства.",
	),

	text(
		'Формат співпраці — на ваш вибір: Партнерство з часткою в корпорації та участь в стратегічному розвитку. Співавторство або консультація в конкретному проєкті. Власний напрям всередині екосистеми — з творчим функціоналом і без обмежень.',
	),

	h3('Інші проєкти'),

	linkList([
		{ title: 'Журнал / Стратегія', url: 'https://buhowski.dev/mvp' },
		{ title: 'Проєкти Кіно', url: 'https://buhowski.dev/cinema' },
		{ title: 'Проєкти Геймдев', url: 'https://buhowski.dev/games' },
		{ title: 'Презентаційні Шоу', url: 'https://buhowski.dev/self-presentation' },
	]),

	text('Якщо відгукнулось — напишіть. Обговоримо деталі.'),

	divider(),

	footer(`${new Date().getFullYear()} © Olexander Tsiomakh`, [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em },
	]),
]);

fs.writeFileSync('email.html', email);
