import { HasNameAndId } from './../types';
import { BibleRepository } from './../repositories/bible-repository';
import { LanguagesRepository } from '../repositories/languages-repository';
export class IndexBuilder {
    private bibleRepository: BibleRepository;
    private languagesRepository: LanguagesRepository;

    constructor(bibleRepository: BibleRepository, languagesRepository: LanguagesRepository) {
        this.bibleRepository = bibleRepository;
        this.languagesRepository = languagesRepository;   
    }

    buildOptionsArray(items: HasNameAndId[]): string[] {
        return ['<option></option>'].concat(
            items
            .map(item => `<option value=${item.id}>${item.name}</option>`)
        );
    }

    async buildHtml(languageId?:string, bibleId?: string, bookId?:string, chapterId?: string,
        comfortableLanguageId?: string, comfortableBibleId?: string): Promise<string> {
        const languages = await this.bibleRepository.getSupportedLanguages();
        const languagesOptions = this.buildOptionsArray(languages);
        let bibleOptions = [];
        let iso6391Code = '';
        if (languageId) {
            bibleOptions = this.buildOptionsArray(await this.bibleRepository.getBibles(languageId));
            iso6391Code = this.languagesRepository.lookupIso6391LanguageCode(languageId);
        }
        let bookOptions = [];
        if (bibleId) {
            bookOptions = this.buildOptionsArray(await this.bibleRepository.getBooks(bibleId));
        }
        let chapterOptions = [];
        if (bookId) {
            chapterOptions = this.buildOptionsArray(await this.bibleRepository.getChapters(bookId));
        }
        let chapterText = '';
        if (chapterId) {
            chapterText = await this.bibleRepository.getChapterText(chapterId);
        }
        let comfortableBibleOptions = [];
        if (comfortableLanguageId) {
            comfortableBibleOptions = this.buildOptionsArray(await this.bibleRepository.getBibles(comfortableLanguageId));
        }
        let comfortableChapterText = '';
        if (comfortableBibleId && chapterId) {
            const chapterIdSansBible = chapterId.substr(chapterId.indexOf(':') + 1);
            const chapterIdForComfortableBible = `${comfortableBibleId}:${chapterIdSansBible}`;
            comfortableChapterText = await this.bibleRepository.getChapterText(chapterIdForComfortableBible);
        }
        return `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <style>
        </style>
        <meta charset="UTF-8">
        <title>Bible Translator</title>
    </head>
    <body onload='setLoadedValues()'>
    <form>
        <p id="currentTranslation"></p>
        <label>Select language you want to learn</label>
        <select id="languages" onChange="reloadWithNewOptions()">${languagesOptions}</select>
        <br/>
        <label>Select bible</label>
        <select id="bibles" onChange="reloadWithNewOptions()">${bibleOptions}</select>
        <br/>
        <label>Select book</label>
        <select id="books" onChange="reloadWithNewOptions()">${bookOptions}</select>
        <br/>
        <label>Select chapter</label>
        <select id="chapters" onChange="reloadWithNewOptions()">${chapterOptions}</select>
        <div><p id="chapterText" onclick="selectWord()">${chapterText}</p></div>
        <label>Select language you are comfortable with</label>
        <select id="comfortableLanguages" onChange="reloadWithNewOptions()">${languagesOptions}</select>
        <br/>
        <label>Select bible for this language</label>
        <select id="comfortableBibles" onChange="reloadWithNewOptions()">${comfortableBibleOptions}</select>
        <br/>
        <div><p id="comfortableChapterText">${comfortableChapterText}</p></div>
    </form>
    </body>
    <script>
        function reloadWithNewOptions() {
            window.location.href = '/?languageId=' + document.getElementById('languages').value
                + '&bibleId=' + document.getElementById('bibles').value
                + '&bookId=' + document.getElementById('books').value
                + '&chapterId=' + document.getElementById('chapters').value
                + '&comfortableLanguageId=' + document.getElementById('comfortableLanguages').value
                + '&comfortableBibleId=' + document.getElementById('comfortableBibles').value
                ;
        }

        function setLoadedValues() {
            document.getElementById('languages').value = '${languageId}';
            document.getElementById('bibles').value = '${bibleId}';
            document.getElementById('books').value = '${bookId}';
            document.getElementById('chapters').value = '${chapterId}';
            document.getElementById('comfortableLanguages').value = '${comfortableLanguageId}';
            document.getElementById('comfortableBibles').value = '${comfortableBibleId}';
        }

        async function selectWord() {
            const s = window.getSelection();
            s.modify('extend','backward','word');        
            const b = s.toString();

            s.modify('extend','forward','word');
            const a = s.toString();
            s.modify('move','forward','character');
            const word = b + a;
            const currentTranslation = document.getElementById('currentTranslation');
            const translated = await translate(word);
            currentTranslation.innerHTML = 'Translation: ' + translated;
        }

        async function translate(word) {
            const url = '${process.env.TRANSLATE_API_URL}?fromLanguageCode=${iso6391Code}&toLanguageCode=en&text=' + word;
            try {
                const translationResponse = await fetch(url);
                if (!translationResponse) {
                    throw new Error('unable to parse ' + word + ' at ' + url);
                }
                return (await translationResponse.json()).translation;
            } catch (error) {
                return 'unable to translate ' + error;
            }
        }
    </script>
</html>`;
    }
}