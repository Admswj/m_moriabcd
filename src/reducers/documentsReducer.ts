import { isCollection, type Document } from '../components';
import { documentTilesProps } from '../data';
import { allDocuments } from '../data/documents';

const slotCount = documentTilesProps.length;

export type DocumentsState = {
  documents: Array<Document | undefined>;
  dimmedTileIndices: number[];
};

export type DocumentsAction =
  | { type: 'openCollection'; clickedIndex: number }
  | { type: 'reset' };

export const createInitialDocumentsState = (): DocumentsState => {
  const documents: Array<Document | undefined> = [undefined, ...allDocuments];
  while (documents.length < slotCount) documents.push(undefined);
  return { documents, dimmedTileIndices: [] };
};

const applyStep = (prev: DocumentsState, i: number): DocumentsState => {
  const doc = prev.documents[i]!;
  const children = isCollection(doc) ? doc.children : [];
  const next = Array.from({ length: slotCount }, () => undefined as Document | undefined);
  const top = prev.dimmedTileIndices.at(-1) ?? 0;
  for (let k = 0; k <= top; k += 1) next[k] = prev.documents[k];
  next[i] = doc;
  for (let c = 0; c < children.length && i + 1 + c < slotCount; c += 1) next[i + 1 + c] = children[c];
  return {
    documents: next,
    dimmedTileIndices: prev.dimmedTileIndices.includes(i) ? prev.dimmedTileIndices : [...prev.dimmedTileIndices, i],
  };
};

export const documentsReducer = (state: DocumentsState, action: DocumentsAction): DocumentsState => {
  if (action.type === 'reset') return createInitialDocumentsState();
  const i = action.clickedIndex;
  if (state.dimmedTileIndices.includes(i)) {
    const p = state.dimmedTileIndices.indexOf(i);
    return state.dimmedTileIndices.slice(0, p + 1).reduce((s, j) => applyStep(s, j), createInitialDocumentsState());
  }
  return applyStep(state, i);
};
