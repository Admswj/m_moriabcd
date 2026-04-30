import type { Collection, Document, DocumentTrailer, Layout, SingleDocument } from './Document';

const COVER_PATH_PREFIX = '/covers/';
const DOCUMENT_PATH_PREFIX = '/documents/';

const getCollectionForName = (name: string, children: Array<Document>): Collection => ({
  name,
  coverSrc: `${COVER_PATH_PREFIX}${name}-cover.jpg`,
  children,
});

const getSingleDocumentForName = (name: string, layout: Layout = 'vertical'): SingleDocument => ({
  name,
  coverSrc: `${COVER_PATH_PREFIX}${name}-cover.jpg`,
  documentSrc: `${DOCUMENT_PATH_PREFIX}${name}-document.pdf`,
  layout,
});

export const matrixTileDocument: SingleDocument = {
  name: 'm_moriabcd',
  documentSrc: 'm_moriabcd-video.mov',
  layout: 'horizontal',
};

const dirimeDocument: DocumentTrailer = {
  name: '[d]',
  coverSrc: `${COVER_PATH_PREFIX}[d]-cover.jpg`
}

export const allDocuments: Array<Document> = [
  getCollectionForName('imag0', [
    getSingleDocumentForName('manifest0'),
    getSingleDocumentForName('libr0'),
    getSingleDocumentForName('a_ibrid0', 'square'),
    getSingleDocumentForName('b_ibrid0', 'square'),
    getSingleDocumentForName('c_ibrid0', 'square'),
  ]),
  getCollectionForName('passat0', [getSingleDocumentForName('esposizi0ne')]),
  getCollectionForName('invit0', [
    getSingleDocumentForName('m0616'),
    getSingleDocumentForName('n0917'),
    getSingleDocumentForName('l0318'),
    getSingleDocumentForName('f0918'),
  ]),
  getCollectionForName('ogett0', [
    getSingleDocumentForName('m_moriabc'),
    getSingleDocumentForName('edizi0ne'),
    dirimeDocument,
  ]),
];
