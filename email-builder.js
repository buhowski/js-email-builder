import fs from 'fs';

const currentYear = new Date().getFullYear();

const icons = {
	tg: {
		src: 'https://buhowski.dev/assets/email/tg.png',
		alt: 'Telegram',
	},
	ig: {
		src: 'https://buhowski.dev/assets/email/insta.png',
		alt: 'Instagram',
	},
	li: {
		src: 'https://buhowski.dev/assets/email/in.png',
		alt: 'LinkedIn',
	},
	em: {
		src: 'https://buhowski.dev/assets/email/mail.png',
		alt: 'Gmail',
	},
};

const C = {
	bg: '#212121',
	box: '#1a1a1a',
	boxFooter: '#111111',
	border: '#393939',
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
	font: "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
};

const tableAttr = 'cellpadding="0" cellspacing="0" border="0" role="article"';

const S = {
	cell: (t = 0, b = UI.btm) => `padding: ${t}px ${UI.padX}px ${b}px`,
	h2: `margin:0;color:${C.accent1};font-size:17px;font-weight:normal;text-transform:uppercase;line-height:1.3;letter-spacing:0.3px`,
	text: `margin:0;font-size:15px;line-height:1.5;letter-spacing:0.25px;color:${C.text}`,
	hr: `border:none;border-top:${UI.bW}px solid ${C.border};margin:0`,
	listLink: `display:block;background-color:${C.listBg};text-decoration:none`,
	listText: `padding:9px 0 9px 22px;color:${C.link};font-size:15px`,
	icon: `display:inline-block;border-radius:50%;border:2px solid ${C.border};background-color:${C.box}`,
};

const header = () => `<tr><td style="padding:40px ${UI.padX}px 0;"></td></tr>`;
const h2 = (content, top = 20) =>
	`<tr><td style="${S.cell(top)}"><h2 style="${S.h2}">${content}</h2></td></tr>`;
const text = (content) =>
	`<tr><td style="${S.cell()}"><p style="${S.text}">${content}</p></td></tr>`;
const divider = () => `<tr><td style="padding:25px 0 0;"><hr style="${S.hr}" /></td></tr>`;

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
                    <td align="right" style="padding-right:22px;color:${C.link};">→</td>
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
    <td style="${S.cell(0, 15)}">
      <table ${tableAttr} width="100%">
        ${items
					.map(
						(item) => `
          <tr>
            <td style="padding:0 0 ${UI.btm}px;">
              <table ${tableAttr}>
                <tr>
                  <td width="20" valign="middle"><span style="display:block;width:4px;height:4px;border-radius:50%;background-color:${C.accent2};"></span></td>
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

const footer = (copy, links) => `
  <tr>
    <td bgcolor="${C.boxFooter}" align="center" style="background-color:${C.boxFooter};padding:40px 18px;">
      <p style="margin:0 0 26px;text-align:center;letter-spacing:1px;font-size:13px;color:#666;">
        ${copy}
      </p>
      <table ${tableAttr} align="center">
        <tr>
          ${links
						.map(
							({ url, icon, alt }) => `
            <td style="padding:0 5px;">
              <a href="${url}" target="_blank" rel="noopener noreferrer" style="${S.icon}">
                <img src="${icon}" alt="${alt}" width="51" height="51" style="display:block;border:0;outline:none;text-decoration:none;" />
              </a>
            </td>`,
						)
						.join('')}
        </tr>
      </table>
    </td>
  </tr>`;

const compile = (blocks) => `<!DOCTYPE html>
<html lang="uk" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <meta name="color-scheme" content="dark">
  <title></title>
</head>
<body style="margin:0;padding:0;background-color:${C.bg};font-family:${UI.font};">
  <table width="100%" ${tableAttr} bgcolor="${C.bg}">
    <tr>
      <td align="center" style="padding:30px 10px;">
        <table width="600" ${tableAttr} bgcolor="${C.box}" style="width:100%;max-width:600px;background-color:${C.box};border-radius:20px;border:${UI.bW}px solid ${C.border};overflow:hidden;">
          ${blocks.join('')}
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

// Email Info
const emailInfo = {
	from: 'Olexander Tsiomakh',
	subject: 'Тема',
};

// Send Email To
const recipients = ['МИЛО'];

// HTML EMAIL TEXT EXAMPLE
const emailText = [
	header(),
	text('Привіт.'),
	text(
		'Я Олександр — ідейний розробник, сценарист і дослідник. Створюю незалежний медіапростір і формую коло співзасновників, тому пишу з пропозицією творчої та ділової співпраці.',
	),
	h2('Проєкт'),
	text(
		'Розважальне контркультурне медіа і соціальна платформа масштабуються у кіновиробництво, геймдев і технологічні розробки. Наступний крок — запуск стрімінгового сервісу та ігрового хабу для запуску власних проєктів.',
	),
	text('Зараз на етапі формування команди.'),
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
		'Співзасновників, партнерів і творців з критичним мисленням, схожою оцінкою реальності та вайбом інтелектуального хуліганства.',
	),
	h2('Пропоную'),
	bulletList([
		'Рівноправне партнерство з часткою в екосистемі та участь у формуванні стратегії.',
		'Власний напрям всередині платформи — з повною творчою свободою і автономією.',
		'Співавторство або консультування проєктів.',
	]),
	text('Якщо відгукнулось — напишіть, обговоримо деталі.'),
	divider(),
	footer(`${currentYear} © Olexander Tsiomakh`, [
		{ url: 'https://t.me/olexander_tsiomakh', icon: icons.tg.src, alt: icons.tg.alt },
		{ url: 'https://www.instagram.com/buhowski', icon: icons.ig.src, alt: icons.ig.alt },
		{ url: 'https://www.linkedin.com/in/olexander', icon: icons.li.src, alt: icons.li.alt },
		{ url: 'mailto:olexander.tsiomakh@gmail.com', icon: icons.em.src, alt: icons.em.alt },
	]),
];

export {
	compile,
	emailText,
	recipients,
	emailInfo,
	currentYear,
	header,
	h2,
	icons,
	text,
	divider,
	linkList,
	bulletList,
	footer,
};

// Output HTML Email
fs.writeFileSync('index.html', compile(emailText));
