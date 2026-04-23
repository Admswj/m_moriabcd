type DocumentBase = {
    name: string;
    coverSrc: string;
}

export type Document = DocumentBase & ({
    children: Array<Document>;
} | {
    documentSrc: string;
})

export const isCollection = (doc: Document): doc is Document & { children: Array<Document> } => 'children' in doc

export const isSingleDocument = (doc: Document): doc is Document & { children: Array<Document> } => 'documentSrc' in doc
