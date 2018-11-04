export interface HasNameAndId {
    name: string;
    id: string;
}

export interface Chapter extends HasNameAndId {
    nextId: string;
    previousId: string;
    name: string;
}

export interface Book extends HasNameAndId {
}

export interface Bible extends HasNameAndId {
    languageId: string;
}

export interface Language extends HasNameAndId {
}