import React, { createContext, useState, useContext } from 'react';
import { translations } from './translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('fr');

    const t = (path) => {
        const keys = path.split('.');
        let value = translations[lang];
        for (const key of keys) {
            if (value[key]) {
                value = value[key];
            } else {
                return path; // Return key if not found
            }
        }
        return value;
    };

    const switchLanguage = (newLang) => {
        if (translations[newLang]) {
            setLang(newLang);
        }
    };

    return (
        <LanguageContext.Provider value={{ lang, t, switchLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
