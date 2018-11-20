import { LanguagesRepository } from './../repositories/languages-repository';
import { TodaysReadingBuilder } from './../html/todays-reading-builder';
import { TodaysReadingRepository } from './../repositories/todays-reading-repository';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';

export const todaysReading: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
    // TODO, post backs, ewwwww
    const queryStringParameters = event.queryStringParameters || {};
    const languageId = queryStringParameters.languageId;
    const comfortableLanguageId = queryStringParameters.comfortableLanguageId;
    const todaysReadingRepository = new TodaysReadingRepository();
    const languagesRepository = new LanguagesRepository();
    const todaysReadingBuilder = new TodaysReadingBuilder(todaysReadingRepository, languagesRepository);
    const html = await todaysReadingBuilder.buildHtml(languageId, comfortableLanguageId);
    const response = {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: html,
    };

    cb(null, response);
}
