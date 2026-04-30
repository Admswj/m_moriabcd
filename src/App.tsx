import { Fragment, useCallback, useEffect, useLayoutEffect, useReducer, useState } from 'react';
import type { CSSProperties } from 'react';
import {Footer, Plane, DocumentTile, NovepvntiTile, Explorer, isSingleDocument} from './components';
import { PLANE_SIZE } from './components/Plane';
import { createInitialDocumentsState, documentsReducer } from './reducers/documentsReducer';
import { allDocuments, documentTilesProps, matrixTileProps, PLANE_HUB_OVERFLOW_X_PLANE_UNITS, projectTileProps } from './data';
import { collectPdfSrcsFromDocuments, preloadPdfSrcs } from './pdfPreload';
import './App.css';
import type {SingleDocument} from "./components/DocumentTile";

export const App = () => {
  const [{ documents, indicesPath }, dispatch] = useReducer(documentsReducer, undefined, createInitialDocumentsState);
  const [explorerPdfPage, setExplorerPdfPage] = useState(1);
  const [explorerPdfNumPages, setExplorerPdfNumPages] = useState<number | null>(null);

  const latestIndex = indicesPath.length > 0 ? indicesPath[indicesPath.length - 1]! : undefined;
  const activeExplorerDoc =
    latestIndex !== undefined && documents[latestIndex] && isSingleDocument(documents[latestIndex]!) ?
      (documents[latestIndex]! as SingleDocument)
    : null;
  const explorerIsPdf =
    Boolean(activeExplorerDoc) &&
    activeExplorerDoc!.layout !== 'horizontal' &&
    activeExplorerDoc!.documentSrc.toLowerCase().endsWith('.pdf');

  useLayoutEffect(() => {
    setExplorerPdfPage(1);
    setExplorerPdfNumPages(null);
  }, [activeExplorerDoc?.documentSrc, activeExplorerDoc?.layout, latestIndex]);

  useEffect(() => {
    if (explorerPdfNumPages == null) return;
    setExplorerPdfPage((p) => Math.min(Math.max(1, p), explorerPdfNumPages));
  }, [explorerPdfNumPages]);

  useEffect(() => {
    preloadPdfSrcs(collectPdfSrcsFromDocuments(allDocuments));
  }, []);

  const onCollectionTileClick = useCallback((clickedIndex: number) => {
    dispatch({ type: 'click', clickedIndex });
  }, []);

  const footerPdfNav =
    Boolean(activeExplorerDoc) &&
    explorerIsPdf &&
    explorerPdfNumPages !== null &&
    explorerPdfNumPages > 1;

  return (
    <main>
      <div className='app-body'>
        <div
          className='app-plane-hub'
          style={
            {
              '--plane-hub-overflow-x': PLANE_HUB_OVERFLOW_X_PLANE_UNITS,
              '--plane-size': PLANE_SIZE,
            } as CSSProperties
          }>
          <Plane className='app-plane'>
            <NovepvntiTile
              {...matrixTileProps}
              onClick={indicesPath.length === 0 ? () => onCollectionTileClick(0) : undefined}
              opacity={indicesPath.length > 0 ? 0.1 : 1}
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
                      coverOpacity={dimmed ? 0.1 : 1}
                      labelPinned={dimmed || index === 0}
                      labelClickable={trailRewindable}
                      interactionInert={isLatestDimmed}
                      onClick={index !== 0 ? () => onCollectionTileClick(index) : undefined}
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
            onPdfLoaded={explorerIsPdf ? setExplorerPdfNumPages : undefined}
          />
        : null}
      </div>
      {footerPdfNav && explorerPdfNumPages !== null ?
        <Footer
          mode='navigation'
          pdfPage={explorerPdfPage}
          pdfNumPages={explorerPdfNumPages}
          onPrevious={() => setExplorerPdfPage((p) => Math.max(1, p - 1))}
          onNext={() => setExplorerPdfPage((p) => Math.min(explorerPdfNumPages, p + 1))}
          onDownload={() => {}}
        />
      : <Footer mode='link' prefixed={false} />}
    </main>
  );
};
