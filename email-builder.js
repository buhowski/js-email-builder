// email-builder.js — compose email from blocks, output email.html

import fs from 'fs';

// ─── ICONS
const icons = {
	tg: 'https://buhowski.dev/assets/email/tg.png',
	ig: 'https://buhowski.dev/assets/email/insta.png',
	li: 'https://buhowski.dev/assets/email/in.png',
	em: 'https://buhowski.dev/assets/email/mail.png',
};

// ─── TOKENS
const C = {
	bg: '#212121',
	box: '#1a1a1a',
	boxFooter: '#111111',
	border: '#383838',
	accent1: '#e4a65b',
	accent2: '#c47f7f',
	text: '#c8c8c8',
	linkColor: '#5199e1',
	listLinkBg: '#222222',
};

const pad = { x: 28, blockBtm: 15 };
const fontSize = { base: '15px', small: '13px', h2: '17px', h3: '16px' };
const borderWidth = 2;
const textSpc = 'line-height:1.5;letter-spacing:0.25px;';

// ─── SHARED STYLES
const shared = {
	cell: `padding:0 ${pad.x}px ${pad.blockBtm}px`,
	headBase: `margin:0;font-weight:normal;line-height:1.3;letter-spacing:0.3px;text-transform:uppercase`,
	text: `margin:0;font-size:${fontSize.base};color:${C.text};${textSpc}`,
	icon: `display:inline-block;overflow:hidden;border-radius:50%;text-align:center;border:2px solid ${C.border};background-color:${C.box};`,
	hr: `border:none;border-top:${borderWidth}px solid ${C.border};margin:0`,
	// ─── list
	listLink: `vertical-align:middle;font-size:${fontSize.base};line-height:1.2;color:${C.linkColor};`,
	listPad: `padding:9px 0 9px 22px;`,
	listPadRight: `padding:9px 22px 9px 10px;`,
	listArrow: `font-size:20px;`,
	// ─── bullet
	bulletDot: `display:block;width:4px;height:4px;border-radius:50%;background-color:${C.accent2};`,
};

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
    <td style="padding:2px ${pad.x}px 20px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${items
					.map(({ title, url }, i) => {
						const gap =
							i < items.length - 1
								? `<tr><td style="height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>`
								: '';
						return `
        <tr>
          <td style="border-left:${borderWidth}px solid ${C.accent2};">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="display:block;background-color:${C.listLinkBg};text-decoration:none;letter-spacing:0.35px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td style="${shared.listLink}${shared.listPad}">${title}</td>
                  <td align="right" style="${shared.listLink}${shared.listArrow}${shared.listPadRight}">→</td>
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

const bulletList = (items) => `
  <tr>
    <td style="padding:0 ${pad.x}px 10px;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        ${items
					.map(
						(item) => `
        <tr>
          <td style="padding:0 0 ${pad.blockBtm}px;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td width="20" style="vertical-align:middle;padding:0 0 1px 2px;">
                  <span style="${shared.bulletDot}"></span>
                </td>
                <td style="${shared.text}">${item}</td>
              </tr>
            </table>
          </td>
        </tr>`,
					)
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
	const iconWidth = 51;

	return `
  <tr>
    <td bgcolor="${C.boxFooter}" align="center" style="background-color:${C.boxFooter};padding:35px 23px;">
      <p style="margin:0 0 26px;text-align:center;">
        <a href="https://buhowski.dev" target="_blank" rel="noopener noreferrer" style="font-size:${fontSize.small};color:#666666;text-decoration:none;letter-spacing:1px;padding:8px 10px;">${resolvedCopy}</a>
      </p>
      <table cellpadding="0" cellspacing="0" border="0" align="center">
        <tr>
          ${links
						.map(
							({ url, icon }) => `
          <td style="padding:0 5px;">
            <a href="${url}" target="_blank" rel="noopener noreferrer" style="${shared.icon};">
              <img src="${icon}" alt="contact" width="${iconWidth}" height="${iconWidth}" style="display:block;" />
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
<body style="margin:0;padding:0;background-color:${bg};font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${bg}" style="width:100%;background-color:${bg};">
    <tr>
      <td align="center" style="padding:30px 5px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.box}" style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;font-size:${fontSize.base};font-weight:normal;width:100%;max-width:600px;background-color:${C.box};border-radius:20px;border:${borderWidth}px solid ${C.border};box-shadow:0 0 10px #000000;overflow:hidden;">
          ${blocks.join('\n')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

export { compile, header, h2, h3, text, linkList, divider, footer, icons };

// ─── COMPOSE
const email = compile([
	header(),

	text('Привіт.'),

	text(
		'Я Олександр — ідейний розробник, сценарист і дослідник. Створюю незалежний медіапростір і формую коло співзасновників і партнерів, тому пишу з пропозицією творчої та ділової співпраці.',
	),

	h2('Проєкт'),

	text(
		'Розважальне контркультурне медіа і соціальна платформа еволюціонують у кіновиробництво, геймдев і технологічні розробки. Після цього інтегруються стрімінговий сервіс та ігровий хаб для запуску власних проєктів.',
	),

	text('Етап — формування команди.'),

	text(
		'Є стратегія, готові сценарії та ідеї для кіно, серіалів, анімації, презентаційних шоу і геймдев проєктів:',
	),

	linkList([
		{ title: 'Повна картина / Бізнес-план', url: 'https://buhowski.dev/vision' },
		{ title: 'Стратегія / Журнал', url: 'https://buhowski.dev/mvp' },
		{ title: 'Кіновиробництво', url: 'https://buhowski.dev/cinema' },
		{ title: 'Геймдев', url: 'https://buhowski.dev/games' },
		{ title: 'Презентаційні шоу', url: 'https://buhowski.dev/self-presentation' },
	]),

	h2('Шукаю'),

	text(
		'Співзасновників, партнерів, консультантів і кріейторів із критичним мисленням, схожою оцінкою реальності та вайбом інтелектуального хуліганства.',
	),

	h2('Пропоную'),

	bulletList([
		'Партнерство з часткою в екосистемі та участь у стратегічному розвитку.',
		'Власний напрям всередині платформи — з повним творчим функціоналом і без обмежень.',
		'Співавторство або консультація проєктів.',
	]),

	text('Формат — на ваш вибір.'),

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
