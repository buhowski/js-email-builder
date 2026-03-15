import 'dotenv/config';
import nodemailer from 'nodemailer';
import { htmlToText } from 'html-to-text';
import { compile } from './email-builder.js';
import { emailText, emailInfo, recipients } from './email-to.js';

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

const htmlEmail = compile(emailText);
const plainText = htmlToText(htmlEmail, {
	wordwrap: 80,
	selectors: [{ selector: 'img', format: 'skip' }],
});

async function main() {
	for (const to of recipients) {
		await transporter.sendMail({
			from: `${emailInfo.from} <${process.env.GMAIL_USER}>`,
			to,
			subject: emailInfo.subject,
			html: htmlEmail,
			text: plainText,
			headers: {
				'List-Unsubscribe': '<mailto:olexander.tsiomakh@gmail.com?subject=unsubscribe>',
			},
		});
		console.log(`Sent → ${to}`);
	}
}

main().catch(console.error);
