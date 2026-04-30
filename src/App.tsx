import { Fragment, useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import type { CSSProperties } from 'react';
import {Footer, Plane, DocumentTile, NovepvntiTile, Explorer, isSingleDocument} from './components';
import { PLANE_SIZE } from './components/Plane';
import { createInitialDocumentsState, documentsReducer } from './reducers/documentsReducer';
import {
  documentTilesProps,
  EDIZIONE_NAME,
  matrixTileProps, OGETTO_NAME,
  PLANE_X_OVERFLOW,
  projectTileProps
} from './data';
import './App.css';

export const App = () => {
  const [{ documents, indicesPath }, dispatch] = useReducer(documentsReducer, undefined, createInitialDocumentsState);
  const [explorerPdfPage, setExplorerPdfPage] = useState(1);
  const [explorerPdfNumPages, setExplorerPdfNumPages] = useState<number | null>(null);

  const latestIndex = indicesPath.at(-1);
  const activeExplorerDoc =
    latestIndex !== undefined && documents[latestIndex] && isSingleDocument(documents[latestIndex]) ?
      (documents[latestIndex])
    : null;

  useLayoutEffect(() => {
    setExplorerPdfPage(1);
    setExplorerPdfNumPages(null);
  }, [activeExplorerDoc?.documentSrc, activeExplorerDoc?.layout, latestIndex]);

  useEffect(() => {
    if (explorerPdfNumPages == null) return;
    setExplorerPdfPage((p) => Math.min(Math.max(1, p), explorerPdfNumPages));
  }, [explorerPdfNumPages]);

  const onCollectionTileClick = useCallback((clickedIndex: number) => {
    dispatch({ type: 'click', clickedIndex });
  }, []);

  const footerPdfNav =
    Boolean(activeExplorerDoc) &&
    explorerPdfNumPages !== null &&
    explorerPdfNumPages > 1;

  return (
    <main>
      <div className='app-body'>
        <div
          className='app-plane-hub'
          style={
            {
              '--plane-hub-overflow-x': PLANE_X_OVERFLOW,
              '--plane-size': PLANE_SIZE,
            } as CSSProperties
          }>
          <Plane className='app-plane'>
            <NovepvntiTile
              {...matrixTileProps}
              onClick={indicesPath.length === 0 ? () => onCollectionTileClick(0) : undefined}
              opacity={indicesPath.length > 0 ? 0.1 : matrixTileProps.opacity}
            />
            {documentTilesProps.map((props, index) => {
              const dimmed = indicesPath.includes(index);
              const latestDimmed = indicesPath.at(-1);
              const isLatestDimmed = latestDimmed === index;
              const trailRewindable = dimmed && !isLatestDimmed;
              return documents[index] ?
                  <Fragment key={`${index}-${documents[index]!.name}`}>
                    <DocumentTile
                      {...props}
                      document={documents[index]!}
                      labelPinned={dimmed || index === 0}
                      labelClickable={trailRewindable}
                      onClick={![0, latestDimmed].includes(index) ? () => onCollectionTileClick(index) : undefined}
                    />
                  </Fragment>
                : undefined;
            })}
            <NovepvntiTile
              {...projectTileProps}
              onClick={() => dispatch({ type: 'reset' })}
            />
          </Plane>
        </div>
        {activeExplorerDoc ?
          <Explorer
            layout={activeExplorerDoc.layout}
            documentSrc={activeExplorerDoc.documentSrc}
            pdfPage={explorerPdfPage}
            onPdfLoaded={setExplorerPdfNumPages}
          />
        : null}
      </div>
      {footerPdfNav && explorerPdfNumPages !== null ?
        <Footer
          mode='navigation'
          pdfPage={explorerPdfPage}
          pdfPagesNum={explorerPdfNumPages}
          onPrevious={() => setExplorerPdfPage((p) => Math.max(1, p - 1))}
          onNext={() => setExplorerPdfPage((p) => Math.min(explorerPdfNumPages, p + 1))}
          downloadVisible={activeExplorerDoc?.name === EDIZIONE_NAME}
        />
      : <Footer mode='text' prefixed={indicesPath.map(i => documents[i])?.some(d => d?.name === OGETTO_NAME) ?? false} />}
    </main>
  );
};
