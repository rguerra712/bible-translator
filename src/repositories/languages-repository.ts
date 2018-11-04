import { Language } from '../types';
export class LanguagesRepository {
    getIso6393Languages(): Language[] {
        const iso6393 = require('iso-639-3');
        return iso6393.map(code => ({
            name: code.name,
            id: code.iso6393,
        }));
    }

    getIso6393CommonLanguages(): Language[] {
        const commonIds = ['eng', 'fra', 'ger', 'spa', 'ita'];
        return this.getIso6393Languages()
            .filter(language => commonIds.indexOf(language.id) >= 0);
    }
}