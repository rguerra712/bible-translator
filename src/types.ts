export interface Chapter {
    id: string;
    number: string;
    nextId: string;
    previousId: string;
}

export interface Book {
    name: string;
    id: string;
}

export interface Bible {
    name: string;
    id: string;
    languageId: string;
}

export interface Language {
    name: string;
    id: string;
}