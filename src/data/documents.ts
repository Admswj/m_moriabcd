import type { Document } from "../components";

const COVER_PATH_PREFIX = '/covers/';
const DOCUMENT_PATH_PREFIX = '/documents/';

const getCollectionForName = (name: string, children: Array<Document>): Document => ({
    name,
    coverSrc: `${COVER_PATH_PREFIX}${name}-cover.jpg`,
    children
})

const getSingleDocumentForName = (name: string): Document => ({
    name,
    coverSrc: `${COVER_PATH_PREFIX}${name}-cover.jpg`,
    documentSrc: `${DOCUMENT_PATH_PREFIX}${name}-document.pdf`,
})

export const allDocuments: Array<Document> = [
    getCollectionForName('imag0', [
        getSingleDocumentForName('manifest0'),
        getSingleDocumentForName('libr0'),
        getSingleDocumentForName('a_ibrid0'),
        getSingleDocumentForName('b_ibrid0'),
        getSingleDocumentForName('c_ibrid0')
    ]),
    getCollectionForName('passat0', [
        getSingleDocumentForName('')
    ]),
    getCollectionForName('invit0', [
        getSingleDocumentForName('')

    ]),
    getCollectionForName('ogett0', [
        getSingleDocumentForName('edizione'),
        getSingleDocumentForName('m_moraibc'),
        getSingleDocumentForName('edizione'),
    ])
]
