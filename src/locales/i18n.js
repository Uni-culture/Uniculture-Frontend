import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-localstorage-backend";
import { initReactI18next } from "react-i18next";

import translationEN from "./en/translation.json";
import translationKO from "./ko/translation.json";
import translationJP from "./jp/translation.json";
import translationCN from "./cn/translation.json";

const resources = {
    ko: {
        translation: translationKO
    },
    en: {
        translation: translationEN
    },
    jp: {
        translation: translationJP
    },
    cn: {
        translation: translationCN
    }
};

i18n
    .use(Backend) // 마지막으로 선택한 언어 정보를 로컬 스토리지에 저장
    .use(LanguageDetector) // 브라우저에서 언어를 자동으로 감지하여 첫 번째 마운트 시 브라우저 설정 언어로 페이지를 표시
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: "en", // 번역 파일에서 찾을 수 없는 경우 기본 언어
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;