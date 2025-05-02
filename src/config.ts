// @ts-ignore
import config from '../config.json'

type Lang = 'ru' | 'en'
type Theme = 'light' | 'dark'

export type Config = {
  theme: Theme
  language: Lang

  colors: {
    bodyBackground: string
    formBackground: string
  }

  apiUrl: string
  basePath: string
  logo: string | null
  pageTitle: string

  authGoogle?: {
    enabled: boolean
    clientId?: string
  }

  authYandex?: {
    enabled: boolean
    clientId?: string
  }

  authCredentials: {
    enabled: boolean
  }

  copyright: {
    visible: boolean
    displayPoweredBy: boolean
    appName: string
  }
}

export function useConfig(): Config {
  const theme = (
    ['light', 'dark'].includes(config.theme.toLowerCase()) ? config.theme.toLowerCase() : 'light'
  ) as Theme
  return {
    theme,
    language: (['ru', 'en'].includes(config.language.toLowerCase())
      ? config.language.toLowerCase()
      : 'en') as Lang,

    apiUrl: config.apiUrl || '/api',
    basePath: config.basePath || '/admin/auth',
    logo: config.logo || null,
    pageTitle: config.pageTitle || 'TAGER Admin',

    colors: {
      bodyBackground: config.colors.bodyBackground || (theme === 'dark' ? '#000' : '#f1f1f1'),
      formBackground: config.colors.formBackground || (theme === 'dark' ? '#333' : '#fff')
    },

    authGoogle: {
      enabled: config.authGoogle?.enabled || false,
      clientId: config.authGoogle.clientId || undefined
    },

    authYandex: {
      enabled: config.authYandex?.enabled || false,
      clientId: config.authYandex?.clientId || undefined
    },

    authCredentials: {
      enabled: config.authCredentials?.enabled || false
    },

    copyright: {
      visible: Boolean(config.copyright?.visible),
      displayPoweredBy: Boolean(config.copyright?.displayPoweredBy),
      appName: config.copyright?.appName || 'TAGER'
    }
  }
}
