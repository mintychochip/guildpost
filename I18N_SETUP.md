# GuildPost Internationalization (i18n) Setup

## Overview
GuildPost uses a multi-language setup with **Crowdin** for translation management.

## Supported Languages
| Code | Language | Direction |
|------|----------|-----------|
| en | English | LTR |
| es | Español | LTR |
| fr | Français | LTR |
| de | Deutsch | LTR |
| it | Italiano | LTR |
| pt | Português | LTR |
| ru | Русский | LTR |
| zh | 中文 | LTR |
| ja | 日本語 | LTR |
| ko | 한국어 | LTR |
| ar | العربية | RTL |
| he | עברית | RTL |

## File Structure
```
public/locales/
├── en/
│   ├── common.json    # Navigation, footer, common UI
│   ├── server.json    # Server listings, status, actions
│   └── submit.json    # Server submission form
├── es/                # Spanish translations (from Crowdin)
├── fr/                # French translations (from Crowdin)
└── ...
```

## NPM Scripts
```bash
# Install Crowdin CLI
npm install

# Initialize Crowdin project
npm run i18n:init

# Upload source files to Crowdin
npm run i18n:upload

# Download translations from Crowdin
npm run i18n:download

# Full sync (upload + download)
npm run i18n:sync

# Check translation status
npm run i18n:status
```

## Usage in Components
```astro
---
import { t, getStoredLocale } from '../lib/i18n';
const locale = getStoredLocale();
---

<a href="/minecraft">{t('nav.minecraft', locale)}</a>
<span>{t('server.status.online', locale)}</span>
```

## Crowdin Setup Steps

1. **Create Crowdin Project:**
   - Go to https://crowdin.com/project/create
   - Name: `guildpost`
   - Source language: English
   - Target languages: All 12 supported languages

2. **Get API Token:**
   - Account Settings → API → New Token
   - Copy token and set as env var: `CROWDIN_PERSONAL_TOKEN`

3. **Update crowdin.yml:**
   - Add your `project_id` from Crowdin project settings
   - Or run: `npm run i18n:init` and follow prompts

4. **Upload Sources:**
   ```bash
   npm run i18n:upload
   ```

5. **Invite Translators:**
   - Share Crowdin project URL with translators
   - They can translate via web interface

6. **Download Translations:**
   ```bash
   npm run i18n:download
   ```

## GitHub Actions Integration
Add `.github/workflows/crowdin.yml` for automatic sync on push to main.

## Adding New Translation Keys
1. Add key to `public/locales/en/*.json`
2. Run `npm run i18n:upload` to push to Crowdin
3. Translators will see new strings in Crowdin
4. Run `npm run i18n:download` after translations complete