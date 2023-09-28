import Cookie from 'universal-cookie';

import en from './en.json';

type TLangCode =
    | 'en';

interface IDictionary {
    language: string;
    code: string;
    dictionary: Record<string, string>;
}

const cookie = new Cookie();

const defaultLang = cookie.get('lang') || 'ru';

const getLanguage = (lang: TLangCode): IDictionary['dictionary'] => {
    switch (lang) {
        case 'en':
            return en.dictionary;
    }
};

export const getDictionary = (lang: TLangCode = defaultLang) => {
    const dictionary = getLanguage(lang);
    if (dictionary) {
        return (text: string): string => {
            return dictionary[text] as string || text;
        };
    }
    return (text: string): string => text;
};
