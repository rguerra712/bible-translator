import { Language } from '../types';
export class LanguagesRepository {
    getIso6393Languages(): Language[] {
        const iso6393 = require('iso-639-3');
        return iso6393.map(code => ({
            name: code.name,
            id: code.iso6393,
        }));
    }

    getIso6393LanguagesThatHave6391Codes(): Language[] {
        const iso6393 = require('iso-639-3');
        return iso6393
            .filter(code => code.iso6391)
            .map(code => ({
            name: code.name,
            id: code.iso6393,
        }));
    }

    getIso6393CommonLanguages(): Language[] {
        const commonIds = ['eng', 'fra', 'ger', 'spa', 'ita'];
        return this.getIso6393Languages()
            .filter(language => commonIds.indexOf(language.id) >= 0);
    }

    lookupIso6391LanguageCode(code6393:string) {
        const iso6393 = require('iso-639-3');
        const match = iso6393.filter(code => code.iso6393 === code6393);
        if (match.length === 0) {
            throw new Error(`no matching code found for ${code6393}`);
        }
        return match[0].iso6391;
    }
}