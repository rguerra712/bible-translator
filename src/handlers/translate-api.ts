import { APIGatewayEvent, Callback, Context, Handler } from 'aws-lambda';
import * as _ from 'lodash';
import fetch, { Response } from 'node-fetch';

export const translate: Handler = async (event: APIGatewayEvent, context: Context, cb: Callback) => {
    let queryStringParameters = '';
    if (event.queryStringParameters) {
        queryStringParameters = _.map(event.queryStringParameters, (value, name) => `${name}=${value}`)
            .join('&');
    }
    const urlToFetch = `${process.env.TRANSLATOR_API_URL}?${queryStringParameters}`;
    const apiResponse: Response = await fetch(urlToFetch, { headers: { 'X-API-KEY': process.env.TRANSLATOR_API_KEY }});
    const text = await apiResponse.text();
    const response = {
        statusCode: apiResponse.status,
        headers: { 'Content-Type': 'text/html' },
        body: text,
    };
    cb(null, response);
}