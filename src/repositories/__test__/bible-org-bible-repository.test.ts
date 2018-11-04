import { BibleOrgBibleRepository } from './../bible-org-bible-repository';
import { LanguagesRepository } from '../languages-repository';

const languagesRepository = new LanguagesRepository();

describe('getBibles', () => {
    it('should contain known bible in English', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const bibles = await repository.getBibles();

        // Assert
        expect(bibles).toContainEqual({ id: 'eng-KJV', name: 'King James Version', languageId: 'eng-GB'});
    }, 30000);

    it('should contain known bible in Spanish', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const bibles = await repository.getBibles();

        // Assert
        // Should not contain inactive
        expect(bibles).not.toContainEqual({ id: 'spa-BHTI', name: 'La Biblia Hispanoamericana (Traducción Interconfesional, versión hispanoamericana)', languageId: 'spa' });
        expect(bibles).toContainEqual({ id: 'spa-RVR1960', name: 'Biblia Reina Valera 1960', languageId: 'spa'});
    }, 30000);


    it('should only contain known bibles in US English if searching just for US English', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const bibles = await repository.getBibles('eng-US');

        // Assert
        expect(bibles).not.toContainEqual({ id: 'eng-KJV', name: 'King James Version', languageId: 'eng-GB' });
        expect(bibles).toContainEqual({ id: 'eng-NASB', name: 'New American Standard Bible', languageId: 'eng-US' });
        expect(bibles).not.toContainEqual({ id: 'spa-BHTI', name: 'Biblia Reina Valera 1960', languageId: 'spa'});
    }, 30000);

    it('should only contain known bibles in UK English if searching just for UK English', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const bibles = await repository.getBibles('eng-GB');

        // Assert
        expect(bibles).toContainEqual({ id: 'eng-KJV', name: 'King James Version', languageId: 'eng-GB' });
        expect(bibles).not.toContainEqual({ id: 'eng-NASB', name: 'New American Standard Bible', languageId: 'eng-US' });
        expect(bibles).not.toContainEqual({ id: 'spa-BHTI', name: 'Biblia Reina Valera 1960', languageId: 'spa' });
    }, 30000);

    it('should only contain known bible in Spanish if searching just for Spanish', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const bibles = await repository.getBibles('spa');

        // Assert
        expect(bibles).not.toContainEqual({ id: 'eng-KJV', name: 'King James Version', languageId: 'eng-GB' });
        expect(bibles).toContainEqual({ id: 'spa-RVR1960', name: 'Biblia Reina Valera 1960', languageId: 'spa' });
    }, 30000);
});

describe('getLanguages', () => {
    it('should contain US english as known language', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const languages = await repository.getSupportedLanguages();

        // Assert
        expect(languages).toContainEqual({ id: 'eng-GB', name: 'English (UK)' });
    }, 30000);

    it('should contain US english as known language', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const languages = await repository.getSupportedLanguages();

        // Assert
        expect(languages).toContainEqual({ id: 'eng-US', name: 'English (US)' });
    }, 30000);

    it('should contain spanish as known language', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const languages = await repository.getSupportedLanguages();

        // Assert
        expect(languages).toContainEqual({ id: 'spa', name: 'Spanish' });
    }, 30000);

});

describe('getBooks', () => {
    it('should contain genesis as known book', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const books = await repository.getBooks('eng-GNTD');

        // Assert
        expect(books).toContainEqual({ id: 'eng-GNTD:Gen', name: 'Genesis' });
    }, 30000);
});

describe('getChapters', () => {
    it('should contain 2nd timothy with known chapters if both a previous and next', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const books = await repository.getChapters('eng-GNTD:2Tim');

        // Assert
        expect(books).toContainEqual({ id: 'eng-GNTD:2Tim.2', name: '2', number: '2', nextId: 'eng-GNTD:2Tim.3', previousId: 'eng-GNTD:2Tim.1' });
    }, 30000);

    it('should contain 2nd timothy with known chapters if just a previous', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const books = await repository.getChapters('eng-GNTD:2Tim');

        // Assert
        expect(books).toContainEqual({ id: 'eng-GNTD:2Tim.1', name: '1', number: '1', nextId: 'eng-GNTD:2Tim.2', previousId: 'eng-GNTD:2Tim.int' });
    }, 30000);

    it('should contain 2nd timothy with known chapters if just a next', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const books = await repository.getChapters('eng-GNTD:2Tim');

        // Assert
        expect(books).toContainEqual({ id: 'eng-GNTD:2Tim.4', name: '4', number: '4', nextId: 'eng-GNTD:Titus.int', previousId: 'eng-GNTD:2Tim.3' });
    }, 30000);

});

describe('getChapterText', () => {
    it('should contain text from 1 Corinthians Ch 2', async () => {
        // Arrange
        const repository = new BibleOrgBibleRepository(languagesRepository);

        // Act
        const text = await repository.getChapterText('eng-KJVA:1Cor.2');

        // Assert
        expect(text).toContain(`And I, brethren, when I came to you, came not with excellency of speech or of wisdom, declaring unto you the testimony of God`);
        expect(text).toContain(`the things which God hath prepared for them that love him.`);
    }, 30000);
});