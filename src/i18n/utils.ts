import { ui, defaultLang } from './ui'

export function getLangFromUrl(url: URL) {
  const [, lang] = url.pathname.split('/')
  if (lang in ui) return lang as keyof typeof ui
  return defaultLang
}

export function useTranslations(lang: keyof typeof ui) {
  return function t(key: keyof (typeof ui)[typeof defaultLang]) {
    return ui[lang][key] || ui[defaultLang][key]
  }
}

export function getLocalizedPath(path: string, lang: string) {
  if (lang === defaultLang) {
    return path
  }
  return `/${lang}${path}`
}

export function getAlternateLanguage(currentLang: string) {
  return currentLang === 'id' ? 'en' : 'id'
}

export function getAlternateUrl(url: URL, targetLang: string) {
  const currentLang = getLangFromUrl(url)
  let pathname = url.pathname

  // Remove current language prefix if it exists
  if (currentLang !== defaultLang) {
    pathname = pathname.replace(`/${currentLang}`, '')
  }

  // Add target language prefix if it's not the default language
  if (targetLang !== defaultLang) {
    pathname = `/${targetLang}${pathname}`
  }

  // Ensure pathname starts with /
  if (!pathname.startsWith('/')) {
    pathname = `/${pathname}`
  }

  return pathname
}
