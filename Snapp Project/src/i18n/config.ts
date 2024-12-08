import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(HttpBackend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'fr', 'de', 'ja', 'zh'],
    
    interpolation: {
      escapeValue: false
    },
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json'
    },

    detection: {
      order: ['querystring', 'cookie', 'localStorage', 'navigator'],
      caches: ['localStorage', 'cookie'],
      cookieMinutes: 160,
      lookupQuerystring: 'lng'
    }
  });

export default i18n;