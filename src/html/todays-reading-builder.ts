import { LanguagesRepository } from './../repositories/languages-repository';
import { HasNameAndId } from './../types';
import { TodaysReadingRepository } from './../repositories/todays-reading-repository';
export class TodaysReadingBuilder {
    private todaysReadingRepository: TodaysReadingRepository;
    private languagesRepository: LanguagesRepository;

    constructor(todaysReadingRepository: TodaysReadingRepository, languagesRepository: LanguagesRepository) {
        this.todaysReadingRepository = todaysReadingRepository;
        this.languagesRepository = languagesRepository;
    }

    buildOptionsArray(items: HasNameAndId[]): string[] {
        return ['<option></option>'].concat(
            items
                .map(item => `<option value=${item.id}>${item.name}</option>`)
        );
    }

    async buildHtml(languageId?: string, comfortableLanguageId?: string): Promise<string> {
        const languages = await this.todaysReadingRepository.getSupportedLanguages();
        const languagesOptions = this.buildOptionsArray(languages);
        let text = '';
        let iso6391Code = '';
        if (languageId) {
            text = await this.todaysReadingRepository.getTodaysReadingIn(languageId);
            iso6391Code = this.languagesRepository.lookupIso6391LanguageCode(languageId);
        }
        return `<!DOCTYPE html>
<html>
    <head>
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
        <style>
            .navbar {
                overflow: hidden;
                background-color: white;
                position: fixed;
                top: 0;
                width: 100%;
            }

            .clickable-text {
                margin-left: auto;
                margin-right: auto;
                width: 100%;
                font-size: 25px;
            }
        </style>
        <meta charset="UTF-8">
        <title>Bible Translator</title>
    </head>
    <body onload='setLoadedValues()'>
    <form>
        <div class="navbar">
            <label>Current Translation:</label>
            <p id="currentTranslation"></p>
        </div>
        <label>Select language you want to learn</label>
        <select id="languages" onChange="reloadWithNewOptions()">${languagesOptions}</select>
        <br/>
        <label>Select language you are comfortable with</label>
        <select id="comfortableLanguages" onChange="reloadWithNewOptions()">${languagesOptions}</select>
        <br/>
        <div><p id="text" onclick="selectWord()" class="clickable-text">${text}</p></div>
    </form>
    </body>
    <script>
        function reloadWithNewOptions() {
            window.location.href = '/todays-reading/?languageId=' + document.getElementById('languages').value
                + '&comfortableLanguageId=' + document.getElementById('comfortableLanguages').value
                ;
        }

        function setLoadedValues() {
            document.getElementById('languages').value = '${languageId}';
            document.getElementById('comfortableLanguages').value = '${comfortableLanguageId}';
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