import 'dotenv/config';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import { compile, blocks } from './email-builder.js';

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		type: 'OAuth2',
		user: process.env.GMAIL_USER,
		clientId: process.env.GMAIL_CLIENT_ID,
		clientSecret: process.env.GMAIL_CLIENT_SECRET,
		refreshToken: process.env.GMAIL_REFRESH_TOKEN,
	},
});

const html = compile(blocks);
const plainText = htmlToText(html, {
	wordwrap: 80,
	selectors: [{ selector: 'img', format: 'skip' }],
});

const recipients = ['test-1lhf8jfdg@srv1.mail-tester.com', 'olexander.tsiomakh@gmail.com'];

const mailConfig = {
	from: 'Olexander Tsiomakh',
	subject: 'Партнерство: Журнал, Контркультура, Кіно, Геймдев, Технології',
};

for (const to of recipients) {
	await transporter.sendMail({
		from: `${mailConfig.from} <${process.env.GMAIL_USER}>`,
		to,
		subject: mailConfig.subject,
		html,
		text: plainText,
	});

	console.log(`Sent → ${to}`);
}
