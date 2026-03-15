# Email Builder

Static HTML email compiler with live reload.

## Setup
```bash
npm install
```

## Usage
```bash
npm run build / node email-builder.js   # one-time build → email.html
npm run dev   / node server.js          # build + live reload at localhost:3030
npm run send  / node send.js            # send email via Gmail OAuth2
```

## Output

`email.html` — ready to paste into any ESP (Mailchimp, Sendgrid, etc.)

## Files
```
html-email-builder/
├── assets/
│   └── icons.js          # base64 encoded social icons
├── .env                  # credentials (never commit)
├── .env.example          # credentials template
├── .gitignore
├── email-builder.js      # HTML compiler + plain-text export
├── email.html            # build output (auto-generated)
├── package.json
├── README.md
├── send.js               # Gmail sender via OAuth2
└── server.js             # live reload dev server
```