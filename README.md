# PBJ Komplit!

Tempat belajar bahasa Jawa. / A place to learn Javanese language.

## Features

- 🌐 **Bilingual Support**: Full internationalization (i18n) with Indonesian and English
- 📱 **Responsive Design**: Works seamlessly on all devices
- 🎨 **Modern UI**: Clean and intuitive interface
- 🔍 **SEO Optimized**: Proper metadata and language alternates for better search engine visibility

## Internationalization (i18n)

This site supports multiple languages:

- **Indonesian (id)** - Default language, accessible at `/`
- **English (en)** - Accessible at `/en/`

### Language Structure

The i18n implementation includes:

1. **Astro i18n Configuration** (`astro.config.ts`)
   - Configured routing for Indonesian (default) and English
   - Default locale: `id`
   - Supported locales: `id`, `en`

2. **Translation System** (`src/i18n/`)
   - `ui.ts` - Translation dictionaries for UI strings
   - `utils.ts` - Helper functions for language detection and URL generation

3. **Content Organization**
   - Indonesian content: `src/content/posts/`, `src/content/about/`
   - English content: `src/content/posts/en/`, `src/content/about/en/`

4. **Language Switcher**
   - Located in the header for easy language switching
   - Maintains the same page context when switching languages

### Adding New Translations

To add translations for UI elements:

1. Edit `src/i18n/ui.ts`
2. Add the key-value pair in both `en` and `id` sections
3. Use the `t()` function in components to access translations

### Adding Translated Content

For blog posts or pages:

1. Create content in `src/content/posts/en/` for English versions
2. Keep Indonesian versions in `src/content/posts/`
3. Use the same filename for both versions

## Deploy on smbCloud

[![Deploy to smbCloud](https://github.com/smbcloudXYZ/smbcloud-cli/blob/development/deploy.svg)](https://smbcloud.xyz)

## License

MIT
