import { BibleRepository } from './bible-repository';
import fetch from 'node-fetch';
import { Book, Bible, Language, Chapter } from '../types';
import { LanguagesRepository } from './languages-repository';
import * as santizeHtml  from 'sanitize-html';

var AsyncLock = require('async-lock');
var lock = new AsyncLock();
let allBibles: Bible[];

export class BibleOrgBibleRepository implements BibleRepository {
    private languagesRepository: LanguagesRepository;
    
    constructor(languagesRepository: LanguagesRepository) {
        this.languagesRepository = languagesRepository;
    }
    
    private async get(relativeUrl: string) {
        const apiKey = process.env.BIBLE_ORG_API_KEY;
        const response = await fetch(`https://bibles.org/v2/${relativeUrl}`, {
            headers: {
                authorization: `Basic ${Buffer.from(apiKey + ':X').toString('base64')}`
            }
        });
        return await response.json();
    }

    async getSupportedLanguages(): Promise<Language[]> {
        const allLanguages = this.languagesRepository.getIso6393Languages();
        const bibles = await this.getBibles();
        return allLanguages.filter(language => 
            bibles.some(bible => 
                bible.languageId.startsWith(language.id)));
    }

    async getBibles(languageId?:string): Promise<Bible[]> {
        if (!allBibles) {
            await lock.acquire("allBibles", async () => {
                if (!allBibles) {
                    const json = await this.get('versions.json');
                    allBibles = json.map(bible => ({
                        id: bible.id,
                        name: bible.name,
                        languageId: bible.lang,
                    }));
                }
            });
        }
        if (languageId) {
            return allBibles.filter(bible => bible.languageId.startsWith(languageId));
        }
        return allBibles;
    }


    async getBooks(bibleId: string): Promise<Book[]> {
        const json = await this.get(`versions/${bibleId}/books.json`);
        return json.map(bible => ({
            id: bible.id,
            name: bible.name,
        }));
    }
    
    async getChapters(bookId: string): Promise<Chapter[]> {
        const json = await this.get(`books/${bookId}/chapters.js`);
        if (!json || !json.response || !json.response.chapters) {
            throw new Error('no chapters found!');
        }
        return json.response.chapters.map(c => {
            const chapter = {
                id: c.id,
                number: c.chapter,
                nextId: null,
                previousId: null,
            };
            if (c.next && c.next.chapter) {
                chapter.nextId = c.next.chapter.id;
            }
            if (c.previous && c.previous.chapter) {
                chapter.previousId = c.previous.chapter.id;
            }
            return chapter;
        });
    }

    async getChapterText(chapterId: string): Promise<string> {
        const json = await this.get(`chapters/${chapterId}/verses.js`);
        if (!json || !json.response || !json.response.verses) {
            throw new Error('no verses found!');
        }
        const verses = json.response.verses.map(verse => verse.text);
        const stripOptions = {
            transformTags: {
                'h3': () => ({ text: '\n' }),
                'sup': () => ({ text: '  '}),
            },
            allowedTags: []
        }
        const versesStrippedOfHtml = verses.map(verse => santizeHtml(verse, stripOptions));
        return versesStrippedOfHtml.join();
    }


}