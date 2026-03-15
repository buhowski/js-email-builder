# Email Builder

Static HTML email compiler with live reload.

## Setup
```bash
npm install
```

## Usage
```bash
npm run build      # one-time build
npm run dev        # build + live reload
npm run send       # send email via Gmail OAuth2
```

## Files
```
html-email-builder/
├── .env                  # credentials (never commit)
├── email-builder.js      # HTML compiler
├── index.html            # build output
├── send.js               # Gmail sender via OAuth2
└── server.js             # live reload dev server
```