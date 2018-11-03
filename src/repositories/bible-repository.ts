import { Book, Bible, Language, Chapter } from "../types";

export interface BibleRepository {
    getSupportedLanguages(): Promise<Language[]>
    getBibles(languageId?: string): Promise<Bible[]>
    getBooks(bibleId: string): Promise<Book[]>;
    getChapters(bookId: string): Promise<Chapter[]>;
    getChapterText(chapterId: string): Promise<string>;
}