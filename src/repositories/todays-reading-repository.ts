import fetch from "node-fetch";
import * as htmlToText from "html-to-text";
import { Language } from "../types";

export class TodaysReadingRepository {
    
    getSupportedLanguages(): Language[] {
        return [
            { id: 'ita', name: 'Italian' },
            { id: 'eng', name: 'English' },
        ];
    }

    async getTodaysReadingIn(languageId: string): Promise<string> {
        let url;
        switch (languageId) {
            case 'ita': {
                url = 'https://www.chiesacattolica.it/liturgia-del-giorno/';
            }
            break;
        }
        if (!url) return 'Unable to determine language';
        const response = await fetch(url);
        if (response.status !== 200) {
            throw new Error(`unsuccessful response fount at url ${url}`);
        }
        const html = await response.text();
        const options: HtmlToTextOptions = {
            ignoreHref: true,
            ignoreImage: true,
            noLinkBrackets: true,
            uppercaseHeadings: true,
            tables: false,
            preserveNewlines: true,
        };
        const text = htmlToText.fromString(html, options);
        const htmlText = text.replace(/\n/g, '<br />');
        return htmlText;
    }

}