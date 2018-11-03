import { Language } from '../types';

const iso6393 = require('iso-639-3');

export class LanguagesRepository {
    getIso6393Languages(): Language[] {
        return iso6393.map(code => ({
            name: code.name,
            id: code.iso6393,
        }));
    }
}