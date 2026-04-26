export type Layout = 'square' | 'horizontal' | 'vertical';

type DocumentBase = {
  name: string;
  coverSrc?: string;
};

type Collection = DocumentBase & {
  children: Array<Document>;
};

export type SingleDocument = DocumentBase & {
  documentSrc: string;
  layout: Layout;
};

export type Document = Collection | SingleDocument;

export const isCollection = (doc: Document): doc is Collection => 'children' in doc;

export const isSingleDocument = (doc: Document): doc is SingleDocument => 'documentSrc' in doc;
