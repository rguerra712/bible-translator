import { BibleOrgBibleRepository } from './../repositories/bible-org-bible-repository';
import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import { IndexBuilder } from '../html/index-builder';
import { LanguagesRepository } from '../repositories/languages-repository';

export const index: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
  // TODO, post backs, ewwwww
  const languagesRepository = new LanguagesRepository();
  const indexBuilder = new IndexBuilder(new BibleOrgBibleRepository(languagesRepository), languagesRepository);
  const queryStringParameters = event.queryStringParameters || {};
  const languageId = queryStringParameters.languageId;
  const bibleId = queryStringParameters.bibleId;
  const bookId = queryStringParameters.bookId;
  const chapterId = queryStringParameters.chapterId;
  const comfortableLanguageId = queryStringParameters.comfortableLanguageId;
  const comfortableBibleId = queryStringParameters.comfortableBibleId;
  const html = await indexBuilder.buildHtml(languageId, bibleId, bookId, chapterId,
    comfortableLanguageId, comfortableBibleId);
  const response = {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html'},
    body: html,
  };

  cb(null, response);
}
