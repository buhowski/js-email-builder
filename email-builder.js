import fs from 'fs';

// ─── TOKENS & CONFIG
const currentYear = new Date().getFullYear();

const icons = {
	tg: 'https://buhowski.dev/assets/email/tg.png',
	ig: 'https://buhowski.dev/assets/email/insta.png',
	li: 'https://buhowski.dev/assets/email/in.png',
	em: 'https://buhowski.dev/assets/email/mail.png',
};

const C = {
	bg: '#212121',
	box: '#1a1a1a',
	boxFooter: '#111111',
	border: '#383838',
	accent1: '#e4a65b',
	accent2: '#c47f7f',
	text: '#c8c8c8',
	link: '#5199e1',
	listBg: '#222222',
};

const UI = {
	padX: 28,
	btm: 15,
	bW: 2,
	font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif",
};

// Style Composer
const css = (...objs) => Object.assign({}, ...objs);
const s = (obj) =>
	Object.entries(obj)
		.map(([k, v]) => `${k}:${v}`)
		.join(';');

// ─── SHARED STYLE PIECES
const STYLES = {
	baseText: {
		margin: '0',
		'font-size': '15px',
		'line-height': '1.5',
		'letter-spacing': '0.25px',
		color: C.text,
	},
	headBase: {
		margin: '0',
		'font-weight': 'normal',
		'line-height': '1.3',
		'letter-spacing': '0.3px',
		'text-transform': 'uppercase',
	},
	table: { width: '100%', 'border-collapse': 'collapse' },
};

// ─── COMPONENT STYLES
const S = {
	cell: (t = 0, b = UI.btm) => s({ padding: `${t}px ${UI.padX}px ${b}px` }),
	h2: s(css(STYLES.headBase, { color: C.accent1, 'font-size': '17px' })),
	h3: s(css(STYLES.headBase, { color: C.accent2, 'font-size': '16px' })),
	text: s(STYLES.baseText),
	hr: s({ border: 'none', 'border-top': `${UI.bW}px solid ${C.border}`, margin: '0' }),
	// Lists
	listLink: s({
		display: 'block',
		'background-color': C.listBg,
		'text-decoration': 'none',
		'letter-spacing': '0.35px',
	}),
	listText: s({
		padding: '9px 0 9px 22px',
		color: C.link,
		'font-size': '15px',
		'line-height': '1.2',
	}),
	listArrow: s({
		padding: '9px 22px 9px 10px',
		color: C.link,
		'font-size': '20px',
		'line-height': '1.2',
	}),
	bulletDot: s({
		display: 'block',
		width: '4px',
		height: '4px',
		'border-radius': '50%',
		'background-color': C.accent2,
	}),
	// Footer
	icon: s({
		display: 'inline-block',
		overflow: 'hidden',
		'border-radius': '50%',
		'text-align': 'center',
		border: `2px solid ${C.border}`,
		'background-color': C.box,
	}),
};

const tableAttr = 'cellpadding="0" cellspacing="0" border="0"';

// ─── BLOCKS
const header = () => `<tr><td style="padding:40px ${UI.padX}px 0;"></td></tr>`;

const h2 = (content, top = 20) => `
  <tr><td style="${S.cell(top)}"><p style="${S.h2}">${content}</p></td></tr>`;

const h3 = (content, top = 20) => `
  <tr><td style="${S.cell(top)}"><p style="${S.h3}">${content}</p></td></tr>`;

const text = (content) => `
  <tr><td style="${S.cell()}"><p style="${S.text}">${content}</p></td></tr>`;

const linkList = (items) => `
  <tr>
    <td style="${S.cell(2, 20)}">
      <table ${tableAttr} width="100%">
        ${items
					.map(
						({ title, url }, i) => `
          ${i > 0 ? '<tr><td style="height:6px;font-size:0;line-height:0;">&nbsp;</td></tr>' : ''}
          <tr>
            <td style="border-left:${UI.bW}px solid ${C.accent2};">
              <a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.listLink}">
                <table ${tableAttr} width="100%">
                  <tr>
                    <td style="${S.listText}">${title}</td>
                    <td align="right" style="${S.listArrow}">→</td>
                  </tr>
                </table>
              </a>
            </td>
          </tr>`,
					)
					.join('')}
      </table>
    </td>
  </tr>`;

const bulletList = (items) => `
  <tr>
    <td style="${S.cell(0, 10)}">
      <table ${tableAttr} width="100%">
        ${items
					.map(
						(item) => `
          <tr>
            <td style="padding:0 0 ${UI.btm}px;">
              <table ${tableAttr} width="100%">
                <tr>
                  <td width="20" style="vertical-align:middle;padding:0 0 1px 2px;"><span style="${S.bulletDot}"></span></td>
                  <td style="${S.text}">${item}</td>
                </tr>
              </table>
            </td>
          </tr>`,
					)
					.join('')}
      </table>
    </td>
  </tr>`;

const divider = () => `<tr><td style="padding:25px 0 0;"><hr style="${S.hr}" /></td></tr>`;

const footer = (copy, links) => `
  <tr>
    <td bgcolor="${C.boxFooter}" align="center" style="background-color:${C.boxFooter};padding:35px 23px;">
      <p style="margin:0 0 26px;text-align:center;">
        <a href="https://buhowski.dev" target="_blank" rel="noopener noreferrer" style="font-size:13px;color:#666;text-decoration:none;letter-spacing:1px;padding:8px 10px;">
          ${copy}
        </a>
      </p>
      <table ${tableAttr} align="center">
        <tr>
          ${links
						.map(
							({ url, icon }) => `
            <td style="padding:0 5px;">
              <a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.icon}">
                <img src="${icon}" alt="contact" width="51" height="51" style="display:block;" />
              </a>
            </td>`,
						)
						.join('')}
        </tr>
      </table>
    </td>
  </tr>`;

// ─── COMPILE
const compile = (blocks) => `<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <title>Email</title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:${UI.font};">
  <table width="100%" ${tableAttr} bgcolor="${C.bg}" style="width:100%;background-color:${C.bg};">
    <tr>
      <td align="center" style="padding:30px 5px;">
        <table width="600" ${tableAttr} bgcolor="${C.box}" style="width:100%;max-width:600px;background-color:${C.box};border-radius:20px;border:${UI.bW}px solid ${C.border};box-shadow:0 0 10px #000;overflow:hidden;">
          ${blocks.join('')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// ─── COMPOSE & SAVE
const emailHtml = compile([
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

	footer(`${currentYear} © Olexander Tsiomakh`, [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em },
	]),
]);

fs.writeFileSync('email.html', emailHtml);
