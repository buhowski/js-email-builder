# Email Builder

Static HTML email compiler with live reload.

## Structure
```
project/
├── assets/
│   ├── tg.png
│   ├── ig.png
│   ├── in.png
│   └── mail.png
├── email-builder.js
├── server.js
├── email.html
└── package.json
```

## Setup
```bash
npm init -y && npm install chokidar
```

## Usage
```bash
node email-builder.js        # one-time build → email.html
node server.js               # build + live reload at localhost:3030
```

## Blocks
```js
h2(content)
h3(content)
text(content)
text(`text ${link('label', 'url')}`)   // inline link
textLink(content, label, url)          // text + link on new line
divider()
footer(copy, links[])
```

## Output

`email.html` — ready to paste into any ESP (Mailchimp, Sendgrid, etc.)